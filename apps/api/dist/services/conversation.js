import crypto from "crypto";
import { prisma } from "@omni/database";
export async function findOrCreateLeadAndConversation({ organizationId, phone, name, channel = "WHATSAPP", }) {
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneHash = crypto.createHash("sha256").update(cleanPhone).digest("hex");
    // 1. Buscar Lead existente ou criar novo
    let lead = await prisma.lead.findFirst({
        where: {
            organizationId,
            telefoneHash: phoneHash,
        },
    });
    if (!lead) {
        lead = await prisma.lead.create({
            data: {
                organizationId,
                nome: name || `Lead ${cleanPhone.slice(-4)}`,
                telefone: cleanPhone,
                telefoneHash: phoneHash,
                status: "NOVO",
                origemCanal: channel,
                prioridade: "WARM",
                score: 60,
            },
        });
    }
    // 2. Buscar ou criar Conversa ativa
    let conversation = await prisma.conversation.findFirst({
        where: {
            organizationId,
            leadId: lead.id,
            status: "ABERTO",
        },
        orderBy: { createdAt: "desc" },
    });
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                organizationId,
                leadId: lead.id,
                canal: channel,
                status: "ABERTO",
            },
        });
    }
    return { lead, conversation };
}
export async function recordIncomingMessage({ conversationId, text, }) {
    return await prisma.message.create({
        data: {
            conversationId,
            remetenteTipo: "LEAD",
            tipoConteudo: "TEXTO",
            conteudo: text,
            statusEnvio: "ENTREGUE",
        },
    });
}
export async function recordOutgoingMessage({ conversationId, text, }) {
    return await prisma.message.create({
        data: {
            conversationId,
            remetenteTipo: "AGENT_IA",
            tipoConteudo: "TEXTO",
            conteudo: text,
            statusEnvio: "ENVIADO",
        },
    });
}
export async function getRecentHistory(conversationId) {
    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: 6,
    });
    return messages.reverse().map((m) => ({
        role: m.remetenteTipo === "LEAD" ? "user" : "assistant",
        content: m.conteudo,
    }));
}
