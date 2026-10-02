import { prisma } from "@omni/database";
import { sanitizeUserPrompt, buildSecureSystemPrompt } from "./ai-guard.js";
import {
  fetchWithTimeout,
  checkAndIncrementAiBudget,
  estimateAiCost,
} from "./circuit-breaker.js";

export interface SDRMessageHistory {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SDRGenerateParams {
  organizationId: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  userMessage: string;
  history: SDRMessageHistory[];
}

// 1. Busca semântica de contexto na base RAG
export async function searchRAGContext(organizationId: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const safeMessage = sanitizeUserPrompt(userMessage, 1000);

  // Gerar embedding do texto do usuário
  let queryEmbedding: number[] = [];
  if (apiKey && safeMessage) {
    try {
      const res = await fetchWithTimeout("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: safeMessage.slice(0, 4000),
          model: "text-embedding-3-small",
        }),
      }, 15000);

      if (res.ok) {
        const data = await res.json();
        queryEmbedding = data.data[0].embedding;
      }
    } catch (e) {
      console.warn("[AI Engine] Falha ao gerar embedding na OpenAI, buscando chunks diretamente:", e);
    }
  }

  // Tentar busca nativa pgvector
  if (queryEmbedding.length > 0) {
    try {
      const vectorStr = `[${queryEmbedding.join(",")}]`;
      const pgResults = await prisma.$queryRaw<
        Array<{ documento_titulo: string; conteudo_texto: string }>
      >`SELECT * FROM match_knowledge_chunks(${vectorStr}::vector, 0.15, 4, ${organizationId})`;

      if (pgResults && pgResults.length > 0) {
        return pgResults.map((r) => `[Doc: ${r.documento_titulo}]\n${r.conteudo_texto}`).join("\n\n");
      }
    } catch {
      // Fallback para SQLite ou banco sem stored procedure
    }
  }

  // Fallback: Busca os chunks mais recentes da organização
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { organizationId },
    include: { document: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (chunks.length === 0) return "Nenhum documento específico cadastrado. Utilize as diretrizes gerais da empresa.";

  return chunks.map((c) => `[Doc: ${c.document.titulo}]\n${c.conteudoTexto}`).join("\n\n");
}

// 2. Definição das ferramentas (Function Calling)
const SDR_TOOLS = [
  {
    type: "function",
    function: {
      name: "agendar_atendimento",
      description: "Agenda uma reunião comercial, consulta ou test-drive quando o cliente escolhe ou concorda com um dia/horário.",
      parameters: {
        type: "object",
        properties: {
          dataHorario: {
            type: "string",
            description: "Data e horário no formato ISO 8601 (ex: 2026-03-25T14:30:00Z)",
          },
          tipo: {
            type: "string",
            enum: ["TEST_DRIVE", "CONSULTA", "REUNIAO_ONLINE", "VISITA_PRESENCIAL"],
            description: "Tipo de compromisso",
          },
          titulo: {
            type: "string",
            description: "Título breve do agendamento",
          },
        },
        required: ["dataHorario", "tipo", "titulo"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "transferir_para_humano",
      description: "Transfere o atendimento para um atendente/vendedor humano quando o cliente pede ou a IA não tem a informação.",
      parameters: {
        type: "object",
        properties: {
          motivo: {
            type: "string",
            description: "Motivo da transferência para o operador humano",
          },
        },
        required: ["motivo"],
      },
    },
  },
];

// 3. Execução do pipeline de resposta com Groq (Llama 3.3 70B) ou OpenAI GPT-4o-mini
export async function generateSDRResponse({
  organizationId,
  leadId,
  leadName,
  leadPhone,
  userMessage,
  history,
}: SDRGenerateParams): Promise<{ replyText: string; toolCalled?: string }> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const isGroq = Boolean(groqApiKey);
  const apiKey = groqApiKey || openaiApiKey;
  const apiUrl = isGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = isGroq
    ? process.env.GROQ_MODEL || "openai/gpt-oss-120b"
    : "gpt-4o-mini";

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const orgNome = org?.nome || "Nossa Empresa";
  const safeMessage = sanitizeUserPrompt(userMessage, 1500);
  const ragContext = await searchRAGContext(organizationId, safeMessage);

  const systemPrompt = buildSecureSystemPrompt(orgNome, leadName, ragContext);

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.role,
      content: h.role === "user" ? sanitizeUserPrompt(h.content, 1500) : h.content,
    })),
    { role: "user", content: `<user_query>\n${safeMessage}\n</user_query>` },
  ];

  if (!apiKey) {
    // Modo de demonstração / local sem chave de IA
    return {
      replyText: `Olá ${sanitizeUserPrompt(leadName, 50) || ""}! Recebi sua mensagem sobre "${safeMessage}". Como posso te ajudar a agendar ou tirar dúvidas hoje?`,
    };
  }

  // P10: Circuit Breaker e controle diário de orçamento por organização
  const estimatedCost = isGroq ? 0 : 0.001; // ~350 tokens gpt-4o-mini
  const budgetCheck = checkAndIncrementAiBudget(organizationId, estimatedCost);
  if (!budgetCheck.allowed) {
    console.warn(`[AI Circuit Breaker] Organização ${organizationId}: ${budgetCheck.reason}`);
    return {
      replyText: "Olá! Nosso volume de atendimentos automáticos hoje atingiu a capacidade diária máxima. Em instantes um operador humano continuará seu atendimento.",
    };
  }

  try {
    const res = await fetchWithTimeout(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        tools: SDR_TOOLS,
        tool_choice: "auto",
        temperature: 0.5,
        max_tokens: 350,
      }),
    }, 15000);

    if (!res.ok) {
      const err = await res.text();
      console.error(`[AI Engine Error - ${isGroq ? "Groq" : "OpenAI"}]`, err);
      return { replyText: `Olá! Recebi sua mensagem. Um momento enquanto verifico com nossa equipe.` };
    }

    const data = await res.json();
    if (data.usage && !isGroq) {
      const cost = estimateAiCost(model, data.usage.prompt_tokens, data.usage.completion_tokens);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[AI Cost] Tokens: ${data.usage.total_tokens}, Custo Estimado: $${cost.toFixed(5)} USD`);
      }
    }
    const choice = data.choices[0].message;

    // Verificar se a IA chamou alguma ferramenta (Function Calling)
    if (choice.tool_calls && choice.tool_calls.length > 0) {
      const toolCall = choice.tool_calls[0];
      const fnName = toolCall.function.name;
      let args: any = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {}

      if (fnName === "agendar_atendimento") {
        try {
          await prisma.appointment.create({
            data: {
              organizationId,
              leadId,
              titulo: args.titulo || "Agendamento via IA",
              descricao: `Agendado automaticamente pelo SDR no WhatsApp. Tipo: ${args.tipo}`,
              dataHorario: new Date(args.dataHorario || new Date(Date.now() + 86400000)),
              tipo: args.tipo || "VISITA",
              status: "AGENDADO",
            },
          });
          // Atualiza status do Lead no CRM para AGENDADO
          await prisma.lead.update({
            where: { id: leadId },
            data: { status: "AGENDADO", prioridade: "HOT" },
          });
        } catch (e) {
          console.error("[Appointment Create Error]", e);
        }

        return {
          replyText: `Perfeito! Seu agendamento foi registrado com sucesso para nossa equipe. Posso te ajudar com mais alguma informação antes da visita?`,
          toolCalled: "agendar_atendimento",
        };
      }

      if (fnName === "transferir_para_humano") {
        await prisma.lead.update({
          where: { id: leadId },
          data: { prioridade: "HOT" },
        });

        // Pausar IA na conversa para que o atendente humano assuma
        await prisma.conversation.updateMany({
          where: {
            organizationId,
            leadId,
            status: "ABERTO",
          },
          data: { status: "PAUSADO_HUMANO" },
        });

        return {
          replyText: `Compreendo perfeitamente! Já notifiquei um de nossos especialistas humanos da equipe e ele continuará seu atendimento por aqui.`,
          toolCalled: "transferir_para_humano",
        };
      }
    }

    return {
      replyText: choice.content || "Olá! Como posso te ajudar hoje?",
    };
  } catch (error: any) {
    console.error("[OpenAI Exception]", error);
    return {
      replyText: "Olá! Recebi sua mensagem. Em instantes um especialista da nossa equipe entrará em contato!",
    };
  }
}
