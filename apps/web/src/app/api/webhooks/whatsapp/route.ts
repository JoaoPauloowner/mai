import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return NextResponse.json({ error: "Token de verificação inválido" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Processar evento de mensagem de entrada do WhatsApp (Meta ou Evolution)
    const isEvolution = Boolean(body?.event === "messages.upsert" || body?.data?.key);
    
    if (isEvolution) {
      const data = body.data || body;
      const key = data.key;
      if (key && !key.fromMe) {
        const rawPhone = (key.remoteJid || "").replace(/@.*$/, "");
        const senderPhone = normalizePhone(rawPhone);
        const contactName = data.pushName || `Lead ${senderPhone.slice(-4)}`;
        const messageText = (data.message?.conversation || data.message?.extendedTextMessage?.text || "").trim();

        if (senderPhone && messageText) {
          const org = (await prisma.organization.findFirst()) || { id: "default_org" };
          
          let lead = await prisma.lead.findFirst({
            where: { telefone: senderPhone, organizationId: org.id },
          });

          if (!lead) {
            lead = await prisma.lead.create({
              data: {
                organizationId: org.id,
                nome: contactName,
                telefone: senderPhone,
                telefoneHash: hashPhone(senderPhone),
                origemCanal: "WHATSAPP",
                status: "NOVO",
                prioridade: "WARM",
                score: 50,
              },
            });
          }

          let conv = await prisma.conversation.findFirst({
            where: { leadId: lead.id, organizationId: org.id },
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

          await prisma.message.create({
            data: {
              conversationId: conv.id,
              remetenteTipo: "LEAD",
              tipoConteudo: "TEXTO",
              conteudo: messageText,
            },
          });
        }
      }
    }

    return NextResponse.json({ status: "received" });
  } catch (error: any) {
    console.error("[Webhook WhatsApp Next.js Route Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
