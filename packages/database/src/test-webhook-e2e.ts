import { prisma } from "./index.js";
import { generateSDRResponse } from "../../../apps/api/src/services/ai.js";
import { findOrCreateLeadAndConversation, recordIncomingMessage, recordOutgoingMessage, getRecentHistory } from "../../../apps/api/src/services/conversation.js";

async function runE2ETest() {
  console.log("=== INICIANDO TESTE E2E DO MOTOR DE IA (PARTE 0) ===");

  // 1. Garantir que uma organização de teste existe
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        nome: "Omni Auto Seminovos",
        slug: "omni-auto",
        segmento: "AUTO",
        whatsappNumber: "+5511999998888",
      },
    });
  }
  console.log(`✅ [1/5] Organização identificada: "${org.nome}" (ID: ${org.id})`);

  // 2. Simular cadastro de documento RAG
  const doc = await prisma.knowledgeDocument.create({
    data: {
      organizationId: org.id,
      titulo: "Tabela de Veículos em Estoque - Março 2026",
      tipo: "TABELA_PRECOS",
      chunks: {
        create: [
          {
            organizationId: org.id,
            chunkIndex: 0,
            conteudoTexto: "Estoque disponível: Honda Civic Touring 2024 (R$ 189.900, 15.000km, Prata). Aceitamos veículos seminovos na troca com avaliação imediata. Taxa de financiamento especial a 0,99% a.m.",
          },
        ],
      },
    },
  });
  console.log(`✅ [2/5] Documento RAG inserido no banco: "${doc.titulo}"`);

  // 3. Simular chegada de mensagem via Webhook da Meta
  const incomingPhone = "5511988887777";
  const incomingText = "Olá, vocês têm algum Honda Civic disponível e aceitam troca?";
  console.log(`📩 [3/5] Payload simulado da Meta recebido: "${incomingText}" de ${incomingPhone}`);

  const { lead, conversation } = await findOrCreateLeadAndConversation({
    organizationId: org.id,
    phone: incomingPhone,
    name: "Carlos Teste",
    channel: "WHATSAPP",
  });
  await recordIncomingMessage({ conversationId: conversation.id, text: incomingText });
  console.log(`✅ [4/5] Lead criado no CRM (ID: ${lead.id}) e Conversa iniciada (ID: ${conversation.id})`);

  // 4. Executar o Motor de IA (RAG + GPT-4o-mini + Function Calling)
  const history = await getRecentHistory(conversation.id);
  const aiResult = await generateSDRResponse({
    organizationId: org.id,
    leadId: lead.id,
    leadName: lead.nome,
    leadPhone: lead.telefone,
    userMessage: incomingText,
    history,
  });

  await recordOutgoingMessage({ conversationId: conversation.id, text: aiResult.replyText });
  console.log(`🤖 [5/5] Resposta gerada pela IA e gravada no banco:`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`"${aiResult.replyText}"`);
  console.log(`--------------------------------------------------------------------------------`);

  // Validação dos registros no banco
  const totalMessages = await prisma.message.count({ where: { conversationId: conversation.id } });
  console.log(`📊 Validação de Integridade: Total de mensagens salvas na conversa = ${totalMessages}`);

  if (totalMessages >= 2) {
    console.log("🎉 TESTE E2E DA PARTE 0 FINALIZADO COM 100% DE SUCESSO!");
  } else {
    throw new Error("Falha na persistência de mensagens");
  }
}

runE2ETest()
  .catch((e) => {
    console.error("ERRO NO TESTE E2E:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
