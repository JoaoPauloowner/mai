import { generateWithGemini } from "./gemini";
import { generateWithOpenAi } from "./openai";

export interface RagContext {
  empresaNome: string;
  segmento: string;
  leadNome: string;
  leadTelefone: string;
  quizAnswers?: Record<string, any> | null;
  baseConhecimento?: string | null;
  tomDeVoz?: string | null;
  historicoMensagens: Array<{ remetente: string; texto: string }>;
}

/**
 * Constrói o Prompt RAG Contextualizado e gera a resposta do Agente Comercial de IA
 */
export async function generateRagResponse(
  userMessage: string,
  context: RagContext,
  provider: "gemini" | "openai" = "gemini"
): Promise<string> {
  const quizContextStr = context.quizAnswers
    ? `\nRespostas do Lead no Mini-Quiz:\n${JSON.stringify(context.quizAnswers, null, 2)}`
    : "";

  const historyStr = context.historicoMensagens
    .slice(-6)
    .map((m) => `${m.remetente}: ${m.texto}`)
    .join("\n");

  const systemInstruction = `Você é o assistente comercial sênior de IA da empresa "${context.empresaNome}" (Segmento: ${context.segmento}).
Seu objetivo principal é qualificar o lead, tirar dúvidas rapidamente e conduzir para o agendamento de uma visita, test-drive ou reunião comercial.

Diretrizes de Atendimento:
- Responda de forma extremamente natural, humanizada, empática e objetiva (estilo WhatsApp).
- Não use linguagem excessivamente formal ou robótica. Use emojis com moderação.
- Tom de Voz: ${context.tomDeVoz || "Profissional, consultivo, acolhedor e focado em soluções"}.
${context.baseConhecimento ? `\nBase de Conhecimento e Regras da Empresa:\n${context.baseConhecimento}` : ""}
${quizContextStr}
- O nome do cliente é ${context.leadNome}. Sempre use o contexto que ele já informou no formulário para não fazer perguntas repetidas.`;

  const prompt = `Histórico Recente da Conversa:
${historyStr}

Mensagem atual de ${context.leadNome}: "${userMessage}"

Por favor, elabore a melhor resposta comercial para ${context.leadNome}:`;

  if (provider === "gemini") {
    return await generateWithGemini(prompt, { systemInstruction });
  } else {
    return await generateWithOpenAi(prompt, {
      systemPrompt: systemInstruction,
      model: "gpt-4o-mini",
    });
  }
}
