import { prisma } from "@omni/database";

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

  // Gerar embedding do texto do usuário
  let queryEmbedding: number[] = [];
  if (apiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: userMessage.slice(0, 4000),
          model: "text-embedding-3-small",
        }),
      });

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

// 3. Execução do pipeline de resposta com OpenAI GPT-4o-mini
export async function generateSDRResponse({
  organizationId,
  leadId,
  leadName,
  leadPhone,
  userMessage,
  history,
}: SDRGenerateParams): Promise<{ replyText: string; toolCalled?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const orgNome = org?.nome || "Nossa Empresa";
  const ragContext = await searchRAGContext(organizationId, userMessage);

  const systemPrompt = `Você é a assistente de pré-vendas (SDR) inteligente da empresa "${orgNome}".
Seu objetivo é atender o lead ${leadName || ""}, responder dúvidas com base EXCLUSIVAMENTE nas informações fornecidas no contexto da empresa e conduzir o cliente para um agendamento ou contato com a equipe comercial.

DIRETRIZES FUNDAMENTAIS:
1. Responda em português do Brasil, em tom educado, dinâmico e humanizado.
2. Seja CONCISO: no máximo 2 a 3 frases por mensagem. Nunca mande blocos gigantes de texto.
3. Não invente informações que não estejam no contexto da empresa.
4. Encerre sempre com uma pergunta ou chamada para ação clara.
5. Se o cliente concordar com um dia/horário, chame a função "agendar_atendimento".
6. Se o cliente pedir expressamente para falar com humano, chame a função "transferir_para_humano".

INFORMAÇÕES DA EMPRESA (RAG):
${ragContext}`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];

  if (!apiKey) {
    // Modo de demonstração / local sem chave OpenAI
    return {
      replyText: `Olá ${leadName || ""}! Recebi sua mensagem sobre "${userMessage}". Como posso te ajudar a agendar ou tirar dúvidas hoje?`,
    };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        tools: SDR_TOOLS,
        tool_choice: "auto",
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[OpenAI Error]", err);
      return { replyText: `Olá! Recebi sua mensagem. Um momento enquanto verifico com nossa equipe.` };
    }

    const data = await res.json();
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
