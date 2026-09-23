import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";

// 1. Verificação inicial da Meta (Webhook Handshake do Instagram)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "omni_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Token inválido", { status: 403 });
}

// 2. Recepção de Mensagens do Instagram Direct
export async function POST(req: Request) {
  try {
    const body = await req.json();

    let senderId = "";
    let senderName = "Usuário Instagram";
    let messageText = "";

    // Formato Graph API Instagram Direct
    if (body.entry && body.entry[0]?.messaging) {
      const msgEvent = body.entry[0].messaging[0];
      senderId = msgEvent.sender?.id || "";
      messageText = msgEvent.message?.text || "";
    } else if (body.sender && body.text) {
      senderId = body.sender;
      senderName = body.name || "Usuário Instagram";
      messageText = body.text;
    }

    if (!senderId || !messageText) {
      return NextResponse.json({ status: "ignored" });
    }

    const org = await prisma.organization.findFirst({
      where: { instagramConnected: true },
    }) || await prisma.organization.findFirst();

    if (!org) {
      return NextResponse.json({ error: "Nenhuma empresa ativa" }, { status: 400 });
    }

    // Identifica se a mensagem contém alguma palavra-chave de gatilho
    let matchedKeyword: string | null = null;
    let registeredKeywords = ["QUERO", "DESCONTO", "SIMULAR", "ATENDIMENTO"];
    if (org.instagramKeywordsJson) {
      try {
        registeredKeywords = JSON.parse(org.instagramKeywordsJson);
      } catch {
        // default
      }
    }

    const upperText = messageText.toUpperCase();
    for (const kw of registeredKeywords) {
      if (upperText.includes(kw.toUpperCase())) {
        matchedKeyword = kw.toUpperCase();
        break;
      }
    }

    // Para usuários do Instagram usamos o senderId como base do hash
    const fakePhone = `+5500${senderId.slice(-8).padStart(8, "9")}`;
    const fakePhoneHash = hashPhone(fakePhone);

    let lead = await prisma.lead.findFirst({
      where: {
        organizationId: org.id,
        telefoneHash: fakePhoneHash,
      },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          organizationId: org.id,
          nome: senderName,
          telefone: fakePhone,
          telefoneHash: fakePhoneHash,
          status: "NOVO",
          score: matchedKeyword ? 85 : 60,
          scoreJustificativa: matchedKeyword
            ? `Disparou a palavra-chave #${matchedKeyword} no Direct do Instagram.`
            : "Enviou mensagem no Direct do Instagram.",
          origemCanal: "INSTAGRAM_DIRECT",
          directKeyword: matchedKeyword,
          utmSource: "instagram_direct",
          utmMedium: "direct_message",
          ramoInteresse: "Instagram Direct",
        },
      });
    }

    // Registra a conversa
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
          canal: "INSTAGRAM",
          status: "ABERTO",
        },
      });
    }

    await prisma.message.create({
      data: {
        conversationId: conv.id,
        remetenteTipo: "LEAD",
        tipoConteudo: "TEXTO",
        conteudo: messageText,
      },
    });

    await prisma.conversation.update({
      where: { id: conv.id },
      data: { ultimoContato: new Date() },
    });

    return NextResponse.json({ success: true, leadId: lead.id, matchedKeyword });
  } catch (error: any) {
    console.error("Erro no webhook Instagram:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
