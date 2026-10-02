import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

import { isMetaTokenExpired, formatWhatsAppRecipientCandidates } from "@/lib/meta";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: conversationId } = await context.params;
    const body = await req.json();
    const { conteudo, tipoConteudo = "TEXTO", audioDuration } = body;

    const trimmedContent = (conteudo || "").trim();
    if (!trimmedContent) {
      return NextResponse.json(
        { error: "Conteúdo da mensagem é obrigatório" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        lead: true,
        organization: true,
      },
    });

    if (!conversation || conversation.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: "Conversa não encontrada" },
        { status: 404 }
      );
    }

    // 1. Grava a mensagem no banco
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        remetenteTipo: "HUMANO",
        tipoConteudo,
        conteudo: trimmedContent,
        audioDuration: audioDuration ? Number(audioDuration) : null,
        statusEnvio: "PENDENTE",
      },
    });

    // 2. Atualiza a conversa para PAUSADO_HUMANO (desliga o bot automático para este lead)
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: "PAUSADO_HUMANO",
        ultimoContato: new Date(),
      },
    });

    // 3. Disparo externo via WhatsApp (Meta Cloud API ou Evolution API)
    let sendSuccess = true;
    let externalError: string | null = null;

    const org = conversation.organization;
    const leadPhone = conversation.lead?.telefone?.replace(/\D/g, "");

    if (conversation.canal === "WHATSAPP" && leadPhone) {
      const metaToken = org.metaAccessToken || process.env.META_ACCESS_TOKEN;
      const metaPhoneId = org.metaPhoneNumberId || process.env.META_PHONE_NUMBER_ID;

      if ((org.whatsappTipoConexao === "OFICIAL_META" || org.whatsappTipoConexao === "META_CLOUD_API") && metaToken && metaPhoneId) {
        try {
          const candidates = formatWhatsAppRecipientCandidates(leadPhone);
          let sentOk = false;
          let lastErrData: any = null;

          for (const targetPhone of candidates) {
            const res = await fetch(`https://graph.facebook.com/v20.0/${metaPhoneId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${metaToken}`,
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: targetPhone,
                type: "text",
                text: { preview_url: false, body: trimmedContent },
              }),
            });

            if (res.ok) {
              sentOk = true;
              sendSuccess = true;
              break;
            } else {
              lastErrData = await res.json().catch(() => ({}));
            }
          }

          if (!sentOk) {
            const errData = lastErrData || {};
            sendSuccess = false;
            externalError = errData?.error?.message || "Erro no envio Meta Graph API";

            if (isMetaTokenExpired(errData)) {
              console.warn(`[Meta API Token Expired] Token inválido/expirado para org ${org.id}. Atualizando whatsappStatus para DISCONNECTED.`);
              await prisma.organization.update({
                where: { id: org.id },
                data: { whatsappStatus: "DISCONNECTED" },
              });
              try {
                await prisma.auditLog.create({
                  data: {
                    organizationId: org.id,
                    userId: session.userId,
                    acao: "WHATSAPP_TOKEN_EXPIRED",
                    detalhes: "Token da Meta Graph API expirado/inválido (código 190). Canal WhatsApp marcado como DISCONNECTED no painel.",
                  },
                });
              } catch {}
            }
          }
        } catch (err: any) {
          sendSuccess = false;
          externalError = err?.message || "Falha de rede ao conectar à Meta API";
        }
      } else if (org.whatsappTipoConexao === "QR_CODE") {
        const evolutionUrl = process.env.EVOLUTION_API_URL?.replace(/\/$/, "");
        const apiKey = process.env.EVOLUTION_API_KEY;
        const instanceName = `omni_${org.slug}`;

        if (evolutionUrl && apiKey) {
          try {
            const res = await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: apiKey,
              },
              body: JSON.stringify({
                number: leadPhone,
                text: trimmedContent,
                delay: 1000,
              }),
            });

            if (!res.ok) {
              sendSuccess = false;
              externalError = "Falha no envio via Evolution API";
            }
          } catch (err: any) {
            sendSuccess = false;
            externalError = err?.message || "Falha de conexão com Evolution API";
          }
        }
      }
    }

    // 4. Atualiza o status final de envio da mensagem
    const updatedMessage = await prisma.message.update({
      where: { id: newMessage.id },
      data: {
        statusEnvio: sendSuccess ? "ENVIADO" : "FALHA",
      },
    });

    return NextResponse.json({
      success: true,
      message: updatedMessage,
      dispatchError: externalError,
    });
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Falha interna ao processar mensagem" },
      { status: 500 }
    );
  }
}

