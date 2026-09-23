import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";

// 1. Verificação inicial da Meta (Webhook Handshake)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "omni_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verificação de token inválida", { status: 403 });
}

// 2. Recepção de Mensagens (Meta Cloud API / Baileys Bridge)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalização flexível para suportar payload da Meta Cloud API e do Baileys
    let senderPhone = "";
    let senderName = "Cliente WhatsApp";
    let messageText = "";
    let isAudio = false;

    // Formato Meta Cloud API
    if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
      const msgData = body.entry[0].changes[0].value.messages[0];
      const contactData = body.entry[0].changes[0].value.contacts?.[0];

      senderPhone = msgData.from;
      senderName = contactData?.profile?.name || "Cliente WhatsApp";
      
      if (msgData.type === "text") {
        messageText = msgData.text?.body || "";
      } else if (msgData.type === "audio" || msgData.type === "voice") {
        messageText = "Mensagem de voz recebida (Áudio WhatsApp)";
        isAudio = true;
      }
    } else if (body.phone && body.message) {
      // Formato Baileys QR Code Bridge
      senderPhone = body.phone;
      senderName = body.name || "Cliente WhatsApp";
      messageText = body.message;
      isAudio = Boolean(body.isAudio);
    }

    if (!senderPhone || !messageText) {
      return NextResponse.json({ status: "ignored_empty" });
    }

    const normalizedPhone = normalizePhone(senderPhone);
    const phoneHash = hashPhone(normalizedPhone);

    // Identifica organização dona do número ou organização padrão
    let org = await prisma.organization.findFirst({
      where: {
        whatsappStatus: "CONNECTED",
      },
    });

    if (!org) {
      org = await prisma.organization.findFirst();
    }

    if (!org) {
      return NextResponse.json({ error: "Nenhuma organização configurada" }, { status: 400 });
    }

    // Busca ou cria o Lead
    let lead = await prisma.lead.findFirst({
      where: {
        organizationId: org.id,
        telefoneHash: phoneHash,
      },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          organizationId: org.id,
          nome: senderName,
          telefone: normalizedPhone,
          telefoneHash: phoneHash,
          status: "NOVO",
          score: 65,
          scoreJustificativa: "Iniciou contato espontâneo pelo WhatsApp.",
          origemCanal: "WHATSAPP",
          ramoInteresse: "Atendimento Geral",
        },
      });
    }

    // Busca ou cria Conversa
    let conv = await prisma.conversation.findFirst({
      where: {
        organizationId: org.id,
        leadId: lead.id,
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          organizationId: org.id,
          leadId: lead.id,
          canal: "WHATSAPP",
          status: "ABERTO",
        },
      });
    }

    // Cria a mensagem
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        remetenteTipo: "LEAD",
        tipoConteudo: isAudio ? "AUDIO_PTT" : "TEXTO",
        conteudo: messageText,
        audioDuration: isAudio ? 12 : null,
      },
    });

    await prisma.conversation.update({
      where: { id: conv.id },
      data: { ultimoContato: new Date() },
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error("Erro no webhook WhatsApp:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
