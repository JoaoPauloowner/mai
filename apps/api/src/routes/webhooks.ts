import { Router, Request, Response } from "express";
import { prisma } from "@omni/database";
import { verifyMetaSignature, sendWhatsAppMessage, sendInstagramMessage } from "../services/meta.js";
import { generateSDRResponse } from "../services/ai.js";
import { findOrCreateLeadAndConversation, recordIncomingMessage, recordOutgoingMessage, getRecentHistory } from "../services/conversation.js";

export const webhookRouter = Router();

// 1. Meta Webhook Handshake (WhatsApp & Instagram)
webhookRouter.get("/whatsapp", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error("[Webhook WhatsApp] META_WEBHOOK_VERIFY_TOKEN não configurado no .env");
    return res.status(500).json({ error: "Servidor não configurado com META_WEBHOOK_VERIFY_TOKEN" });
  }

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[Webhook WhatsApp] Handshake verificado com sucesso!");
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: "Token de verificação inválido" });
});

// 2. WhatsApp Incoming Messages Webhook (Processamento Assíncrono com IA & RAG)
webhookRouter.post("/whatsapp", async (req: Request, res: Response) => {
  // Validação de HMAC com META_APP_SECRET
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const appSecret = process.env.META_APP_SECRET;

  if (appSecret && !verifyMetaSignature(JSON.stringify(req.body), signature, appSecret)) {
    console.warn("[Webhook WhatsApp] Assinatura HMAC X-Hub-Signature-256 inválida. Requisição rejeitada.");
    return res.status(401).json({ error: "Assinatura HMAC inválida" });
  }

  // Responde 200 OK imediatamente para a Meta (em < 50ms)
  res.status(200).json({ status: "received" });

  // Processamento assíncrono em background
  (async () => {
    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (!message || message.type !== "text") {
        return; // Ignora eventos de status de entrega ou mensagens não textuais por enquanto
      }

      const senderPhone = message.from;
      const messageText = message.text?.body?.trim();
      const phoneNumberId = value.metadata?.phone_number_id;

      if (!senderPhone || !messageText) return;

      console.log(`[Webhook WhatsApp] Mensagem recebida de ${senderPhone}: "${messageText}"`);

      // 1. Identificar a Organização dona do número
      const org =
        (await prisma.organization.findFirst({
          where: { metaPhoneNumberId: phoneNumberId },
        })) ||
        (await prisma.organization.findFirst()); // Fallback para a primeira organização para testes

      if (!org) {
        console.warn("[Webhook WhatsApp] Nenhuma organização encontrada para este número.");
        return;
      }

      // 2. Criar ou recuperar Lead e Conversa no banco
      const contactName = value?.contacts?.[0]?.profile?.name || `Lead ${senderPhone.slice(-4)}`;
      const { lead, conversation } = await findOrCreateLeadAndConversation({
        organizationId: org.id,
        phone: senderPhone,
        name: contactName,
        channel: "WHATSAPP",
      });

      // 3. Registrar mensagem de entrada
      await recordIncomingMessage({
        conversationId: conversation.id,
        text: messageText,
      });

      // 4. Buscar histórico recente da conversa
      const history = await getRecentHistory(conversation.id);

      // 5. Executar o Motor de IA (RAG + GPT-4o-mini + Function Calling)
      const { replyText, toolCalled } = await generateSDRResponse({
        organizationId: org.id,
        leadId: lead.id,
        leadName: lead.nome,
        leadPhone: lead.telefone,
        userMessage: messageText,
        history,
      });

      console.log(`[Webhook WhatsApp] Resposta gerada pela IA (Tool: ${toolCalled || "none"}): "${replyText}"`);

      // 6. Registrar resposta de saída no banco
      await recordOutgoingMessage({
        conversationId: conversation.id,
        text: replyText,
      });

      // 7. Enviar mensagem de volta ao cliente via Meta Graph API v20.0
      const metaToken = org.metaAccessToken || process.env.META_ACCESS_TOKEN;
      const targetPhoneId = org.metaPhoneNumberId || phoneNumberId || process.env.META_PHONE_NUMBER_ID;

      if (metaToken && targetPhoneId) {
        const sendResult = await sendWhatsAppMessage({
          phoneNumberId: targetPhoneId,
          accessToken: metaToken,
          to: senderPhone,
          text: replyText,
        });
        console.log(`[Webhook WhatsApp] Disparo Graph API: ${sendResult.success ? "Sucesso" : "Falha: " + sendResult.error}`);
      } else {
        console.log(`[Webhook WhatsApp (Simulação Local)] Resposta gravada no banco. Configure META_ACCESS_TOKEN para envio real.`);
      }
    } catch (error) {
      console.error("[Webhook WhatsApp] Erro no processamento em background:", error);
    }
  })();
});

// 3. Instagram Direct Webhook Handshake & Dispatcher
webhookRouter.get("/instagram", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken) {
    return res.status(500).json({ error: "Servidor não configurado com META_WEBHOOK_VERIFY_TOKEN" });
  }

  if (mode === "subscribe" && token === verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: "Token de verificação inválido" });
});

webhookRouter.post("/instagram", async (req: Request, res: Response) => {
  res.status(200).json({ status: "received" });

  (async () => {
    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (!messaging || !messaging.message?.text) return;

      const senderId = messaging.sender?.id;
      const recipientId = messaging.recipient?.id;
      const messageText = messaging.message.text.trim();

      const org = (await prisma.organization.findFirst()) || { id: "default_org" };

      const { lead, conversation } = await findOrCreateLeadAndConversation({
        organizationId: org.id,
        phone: senderId,
        name: `Instagram User ${senderId.slice(-4)}`,
        channel: "INSTAGRAM_DIRECT",
      });

      await recordIncomingMessage({ conversationId: conversation.id, text: messageText });
      const history = await getRecentHistory(conversation.id);

      const { replyText } = await generateSDRResponse({
        organizationId: org.id,
        leadId: lead.id,
        leadName: lead.nome,
        leadPhone: lead.telefone,
        userMessage: messageText,
        history,
      });

      await recordOutgoingMessage({ conversationId: conversation.id, text: replyText });

      const metaToken = process.env.META_ACCESS_TOKEN;
      if (metaToken) {
        await sendInstagramMessage({
          pageId: recipientId,
          accessToken: metaToken,
          recipientId: senderId,
          text: replyText,
        });
      }
    } catch (error) {
      console.error("[Webhook Instagram] Erro:", error);
    }
  })();
});

// 4. Voice Agent Webhook (Vapi / Bland / ElevenLabs)
webhookRouter.post("/voice", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("[Webhook Voice] Evento recebido:", JSON.stringify(body).slice(0, 150));
    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Billing Webhook (Asaas com Verificação de Token & AuditLog)
webhookRouter.post("/billing", async (req: Request, res: Response) => {
  try {
    const asaasSecret = process.env.ASAAS_WEBHOOK_SECRET;
    const incomingToken = req.headers["asaas-access-token"] as string | undefined;

    if (asaasSecret && incomingToken !== asaasSecret) {
      console.warn("[Billing Webhook Asaas] Token de acesso inválido no header asaas-access-token. Rejeitado.");
      return res.status(401).json({ error: "Token de webhook inválido" });
    }

    const body = req.body;
    const event = body?.event; // ex: PAYMENT_RECEIVED, PAYMENT_OVERDUE
    const customerEmail = body?.payment?.customerEmail || body?.customer;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Billing Webhook Asaas] Evento: ${event} para cliente: ${customerEmail}`);
    }

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const org = await prisma.organization.findFirst({
        where: { emailNotificacoes: customerEmail },
      });

      if (org) {
        await prisma.organization.update({
          where: { id: org.id },
          data: { statusPlano: "ativo" },
        });

        // Grava no AuditLog (Item 8)
        await prisma.auditLog.create({
          data: {
            organizationId: org.id,
            acao: "PAYMENT_CONFIRMED",
            detalhes: `Pagamento recebido via Asaas. Plano reativado para a organização ${org.nome}. Evento: ${event}`,
          },
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
