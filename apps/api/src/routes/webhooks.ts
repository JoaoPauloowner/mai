import { Router, Request, Response } from "express";
import { prisma } from "@omni/database";
import { verifyMetaSignature, sendWhatsAppMessage, sendInstagramMessage } from "../services/meta.js";
import { generateSDRResponse } from "../services/ai.js";
import { findOrCreateLeadAndConversation, recordIncomingMessage, recordOutgoingMessage, getRecentHistory } from "../services/conversation.js";
import { captureProductionError } from "../services/monitoring.js";
import { maskPhone, maskMessage, maskEmail } from "../utils/mask.js";

const processedMessagesCache = new Map<string, number>();

export function isDuplicateWebhookMessage(msgId: string | undefined): boolean {
  if (!msgId) return false;
  const now = Date.now();
  // Limpeza de mensagens com mais de 10 minutos
  for (const [id, timestamp] of processedMessagesCache.entries()) {
    if (now - timestamp > 10 * 60 * 1000) {
      processedMessagesCache.delete(id);
    }
  }
  if (processedMessagesCache.has(msgId)) {
    return true;
  }
  processedMessagesCache.set(msgId, now);
  return false;
}

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

// 2. WhatsApp Incoming Messages Webhook (Meta Cloud API & Evolution API v2)
webhookRouter.post("/whatsapp", async (req: Request, res: Response) => {
  const isEvolutionEvent = Boolean(req.body?.event === "messages.upsert" || req.body?.data?.key || req.body?.instance);
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
  const appSecret = process.env.META_APP_SECRET;

  // S2: Se for evento Evolution API, EXIGE autenticação por API Key
  if (isEvolutionEvent) {
    const evoSecret = process.env.EVOLUTION_API_KEY;
    const authHeader = (req.headers["x-api-key"] || req.headers["authorization"]) as string | undefined;
    const providedKey = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : "";

    if (process.env.NODE_ENV === "production" || evoSecret) {
      if (!evoSecret || !providedKey || providedKey !== evoSecret) {
        console.warn("[Webhook WhatsApp Evolution] Requisição Evolution não autorizada ou sem chave válida.");
        return res.status(401).json({ error: "Não autorizado: Chave de API Evolution inválida ou ausente." });
      }
    }
  } else {
    // Se for evento Meta Cloud API, valida assinatura HMAC sobre o raw body
    if (process.env.NODE_ENV === "production") {
      if (!appSecret) {
        console.error("[Webhook WhatsApp CRITICAL] META_APP_SECRET não está configurado em produção. Rejeitando requisição.");
        await captureProductionError({
          service: "api-railway",
          context: "webhook_whatsapp_auth",
          error: new Error("META_APP_SECRET não configurado em produção"),
        });
        return res.status(500).json({ error: "Configuração de segurança incompleta" });
      }
      if (!signature || !verifyMetaSignature(rawBody, signature, appSecret)) {
        console.warn("[Webhook WhatsApp] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
        return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
      }
    } else if (appSecret && signature) {
      if (!verifyMetaSignature(rawBody, signature, appSecret)) {
        console.warn("[Webhook WhatsApp Dev] Assinatura HMAC inválida.");
        return res.status(401).json({ error: "Assinatura HMAC inválida" });
      }
    }
  }

  // Responde 200 OK imediatamente para o webhook
  res.status(200).json({ status: "received" });

  // Processamento assíncrono em background
  (async () => {
    try {
      const body = req.body;

      // Deduplicação e Idempotência de Webhook
      const processedMessageIds = new Set<string>();

      // ==========================================
      // A) PROCESSAMENTO EVOLUTION API v2 (QR CODE)
      // ==========================================
      if (isEvolutionEvent) {
        const data = body.data || body;
        const key = data.key;
        if (!key || key.fromMe) return; // Ignora mensagens enviadas pelo próprio bot

        const messageId = key.id;
        if (messageId && isDuplicateWebhookMessage(messageId)) {
          console.log(`[Webhook Evolution] Mensagem ${messageId} já processada (idempotência). Descartando.`);
          return;
        }

        const senderPhone = (key.remoteJid || "").replace(/@.*$/, "");
        const contactName = data.pushName || `Lead ${senderPhone.slice(-4)}`;
        const messageText = (data.message?.conversation || data.message?.extendedTextMessage?.text || "").trim();
        const instanceName = body.instance || "";

        if (!senderPhone || !messageText) return;

        console.log(`[Webhook Evolution API] Mensagem de ${maskPhone(senderPhone)} (${contactName}): "${maskMessage(messageText)}"`);

        const orgSlug = instanceName.replace(/^omni_/, "");
        // S3: Resolução estrita de tenant sem fallbacks abertos
        const org = await prisma.organization.findFirst({
          where: {
            OR: [
              { slug: orgSlug },
              { whatsappNumber: senderPhone },
            ],
          },
        });

        if (!org) {
          console.warn(`[Webhook Evolution API] Nenhuma organização associada à instância "${instanceName}". Mensagem ignorada.`);
          return;
        }

        if (org.statusPlano === "bloqueado" || org.statusPlano === "cancelado" || org.statusPlano === "inadimplente") {
          console.warn(`[Webhook Evolution API] Organização "${org.slug}" com plano ${org.statusPlano}. Mensagem ignorada.`);
          return;
        }

        const { lead, conversation } = await findOrCreateLeadAndConversation({
          organizationId: org.id,
          phone: senderPhone,
          name: contactName,
          channel: "WHATSAPP",
        });

        await recordIncomingMessage({
          conversationId: conversation.id,
          text: messageText,
        });

        // P2: Se a conversa estiver sob controle humano, registrar mensagem no inbox mas NÃO gerar resposta da IA
        if (conversation.status === "PAUSADO_HUMANO" || conversation.status === "TRANSFERIDO_HUMANO") {
          console.log(`[Webhook Evolution API] Conversa ${conversation.id} está pausada para operador humano. Resposta de IA suprimida.`);
          return;
        }

        const history = await getRecentHistory(conversation.id);

        const { replyText, toolCalled } = await generateSDRResponse({
          organizationId: org.id,
          leadId: lead.id,
          leadName: lead.nome,
          leadPhone: lead.telefone,
          userMessage: messageText,
          history,
        });

        await recordOutgoingMessage({
          conversationId: conversation.id,
          text: replyText,
        });

        // Envio via Evolution API
        const { sendEvolutionWhatsAppMessage } = await import("../services/meta.js");
        await sendEvolutionWhatsAppMessage({
          instanceName,
          to: senderPhone,
          text: replyText,
        });
        return;
      }

      // ==========================================
      // B) PROCESSAMENTO META CLOUD API OFICIAL
      // ==========================================
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // 1. Tratar eventos de status da conta (account_update)
      if (changes?.field === "account_update") {
        const eventType = value?.event || value?.account_update_type || "UNKNOWN_UPDATE";
        const wabaId = entry?.id;
        const phoneId = value?.phone_number_id || value?.metadata?.phone_number_id;

        console.log(`[Webhook Meta account_update] Evento: ${eventType} (WABA: ${wabaId || "N/A"})`);

        const org = await prisma.organization.findFirst({
          where: {
            OR: [
              ...(wabaId ? [{ metaWabaId: wabaId }] : []),
              ...(phoneId ? [{ metaPhoneNumberId: phoneId }] : []),
            ],
          },
        });

        if (org) {
          const upperEvent = String(eventType).toUpperCase();
          if (
            upperEvent.includes("BANNED") ||
            upperEvent.includes("DISABLED") ||
            upperEvent.includes("RESTRICTED")
          ) {
            await prisma.organization.update({
              where: { id: org.id },
              data: { whatsappStatus: "RESTRICTED" },
            });
            try {
              await prisma.auditLog.create({
                data: {
                  organizationId: org.id,
                  acao: "WHATSAPP_STATUS_CHANGED",
                  detalhes: `Status do WhatsApp alterado para RESTRICTED via Meta account_update: ${eventType}`,
                },
              });
            } catch {}
          } else if (
            upperEvent.includes("CONNECTED") ||
            upperEvent.includes("APPROVED") ||
            upperEvent.includes("VERIFIED")
          ) {
            await prisma.organization.update({
              where: { id: org.id },
              data: { whatsappStatus: "CONNECTED" },
            });
            try {
              await prisma.auditLog.create({
                data: {
                  organizationId: org.id,
                  acao: "WHATSAPP_STATUS_CHANGED",
                  detalhes: `Status do WhatsApp alterado para CONNECTED via Meta account_update: ${eventType}`,
                },
              });
            } catch {}
          }
        }
        return;
      }

      const message = value?.messages?.[0];

      if (!message || message.type !== "text") {
        return;
      }

      const wamid = message.id;
      if (wamid && isDuplicateWebhookMessage(wamid)) {
        console.log(`[Webhook WhatsApp Meta] Mensagem ${wamid} já processada (idempotência). Descartando.`);
        return;
      }

      const senderPhone = message.from;
      const messageText = message.text?.body?.trim();
      const phoneNumberId = value.metadata?.phone_number_id;

      if (!senderPhone || !messageText || !phoneNumberId) return;

      const wabaId = entry?.id;
      // S3: Resolução de organização por phone_number_id ou WABA ID
      // Prioriza organização com whatsappStatus: "CONNECTED" e mais recente
      let org = await prisma.organization.findFirst({
        where: {
          whatsappStatus: "CONNECTED",
          OR: [
            { metaPhoneNumberId: phoneNumberId },
            ...(wabaId ? [{ metaWabaId: wabaId }] : []),
            ...(process.env.META_PHONE_NUMBER_ID ? [{ metaPhoneNumberId: process.env.META_PHONE_NUMBER_ID }] : []),
          ],
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!org) {
        org = await prisma.organization.findFirst({
          where: {
            OR: [
              { metaPhoneNumberId: phoneNumberId },
              ...(wabaId ? [{ metaWabaId: wabaId }] : []),
              ...(process.env.META_PHONE_NUMBER_ID ? [{ metaPhoneNumberId: process.env.META_PHONE_NUMBER_ID }] : []),
            ],
          },
          orderBy: { updatedAt: "desc" },
        });
      }

      if (!org) {
        console.warn(`[Webhook WhatsApp] Nenhuma organização associada ao Phone ID ${phoneNumberId} ou WABA ${wabaId}. Evento descartado.`);
        return;
      }

      if (org.statusPlano === "bloqueado" || org.statusPlano === "cancelado" || org.statusPlano === "inadimplente") {
        console.warn(`[Webhook WhatsApp Meta] Organização "${org.slug}" com plano ${org.statusPlano}. Resposta automática cancelada.`);
        return;
      }

      const contactName = value?.contacts?.[0]?.profile?.name || `Lead ${senderPhone.slice(-4)}`;
      const { lead, conversation } = await findOrCreateLeadAndConversation({
        organizationId: org.id,
        phone: senderPhone,
        name: contactName,
        channel: "WHATSAPP",
      });

      await recordIncomingMessage({
        conversationId: conversation.id,
        text: messageText,
      });

      // P2: Se a conversa estiver sob controle humano, registrar mensagem no inbox mas NÃO gerar resposta da IA
      if (conversation.status === "PAUSADO_HUMANO" || conversation.status === "TRANSFERIDO_HUMANO") {
        console.log(`[Webhook WhatsApp Meta] Conversa ${conversation.id} está pausada para operador humano. Resposta de IA suprimida.`);
        return;
      }

      const history = await getRecentHistory(conversation.id);

      const { replyText, toolCalled } = await generateSDRResponse({
        organizationId: org.id,
        leadId: lead.id,
        leadName: lead.nome,
        leadPhone: lead.telefone,
        userMessage: messageText,
        history,
      });

      console.log(`[Webhook WhatsApp Meta] Resposta gerada (Tool: ${toolCalled || "none"}): "${maskMessage(replyText)}"`);

      await recordOutgoingMessage({
        conversationId: conversation.id,
        text: replyText,
      });

      const metaToken = org.metaAccessToken || process.env.META_ACCESS_TOKEN;
      const targetPhoneId = org.metaPhoneNumberId || phoneNumberId || process.env.META_PHONE_NUMBER_ID;

      if (metaToken && targetPhoneId) {
        const sendResult = await sendWhatsAppMessage({
          phoneNumberId: targetPhoneId,
          accessToken: metaToken,
          to: senderPhone,
          text: replyText,
          organizationId: org.id,
        });
        console.log(`[Webhook WhatsApp Meta] Disparo Graph API: ${sendResult.success ? "Sucesso" : "Falha: " + sendResult.error}`);
      }
    } catch (error) {
      console.error("[Webhook WhatsApp] Erro no processamento em background:", error);
      await captureProductionError({
        service: "api-railway",
        context: "whatsapp_message_pipeline",
        error,
        metadata: { body: req.body },
      });
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
  // Validação de HMAC com META_APP_SECRET (Falha fechada em produção)
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
  const appSecret = process.env.META_APP_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!appSecret) {
      console.error("[Webhook Instagram CRITICAL] META_APP_SECRET não está configurado em produção. Rejeitando requisição.");
      return res.status(500).json({ error: "Configuração de segurança incompleta" });
    }
    if (!signature || !verifyMetaSignature(rawBody, signature, appSecret)) {
      console.warn("[Webhook Instagram] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
      return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
    }
  } else if (appSecret && signature) {
    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      return res.status(401).json({ error: "Assinatura HMAC inválida" });
    }
  }

  res.status(200).json({ status: "received" });

  (async () => {
    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (!messaging || !messaging.message?.text) return;

      const mid = messaging.message.mid;
      if (mid && isDuplicateWebhookMessage(mid)) {
        console.log(`[Webhook Instagram] Mensagem ${mid} já processada (idempotência). Descartando.`);
        return;
      }

      const senderId = messaging.sender?.id;
      const recipientId = messaging.recipient?.id;
      const messageText = messaging.message.text.trim();

      if (!recipientId || !senderId || !messageText) return;

      // S3: Resolução de tenant estrita para Instagram
      const org = await prisma.organization.findFirst({
        where: {
          OR: [
            { instagramHandle: recipientId },
            { id: recipientId },
          ],
        },
      });

      if (!org) {
        console.warn(`[Webhook Instagram] Nenhuma organização associada ao Instagram ID ${recipientId}. Evento ignorado.`);
        return;
      }

      if (org.statusPlano === "bloqueado" || org.statusPlano === "cancelado") {
        console.warn(`[Webhook Instagram] Organização "${org.slug}" com plano ${org.statusPlano}. Resposta automática cancelada.`);
        return;
      }

      const { lead, conversation } = await findOrCreateLeadAndConversation({
        organizationId: org.id,
        phone: senderId,
        name: `Instagram User ${senderId.slice(-4)}`,
        channel: "INSTAGRAM_DIRECT",
      });

      await recordIncomingMessage({ conversationId: conversation.id, text: messageText });

      if (conversation.status === "PAUSADO_HUMANO" || conversation.status === "TRANSFERIDO_HUMANO") {
        console.log(`[Webhook Instagram] Conversa ${conversation.id} está sob atendimento humano. IA pausada.`);
        return;
      }

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
      await captureProductionError({
        service: "api-railway",
        context: "instagram_message_pipeline",
        error,
        metadata: { body: req.body },
      });
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
    await captureProductionError({
      service: "api-railway",
      context: "voice_agent_webhook",
      error,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Billing Webhook (Asaas com Verificação de Token & AuditLog - Falha Fechada em Produção)
webhookRouter.post("/billing", async (req: Request, res: Response) => {
  try {
    const asaasSecret = process.env.ASAAS_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_ACCESS_TOKEN;
    const incomingToken = req.headers["asaas-access-token"] as string | undefined;

    if (process.env.NODE_ENV === "production") {
      if (!asaasSecret) {
        console.error("[Billing Webhook CRITICAL] ASAAS_WEBHOOK_SECRET / ASAAS_WEBHOOK_ACCESS_TOKEN ausente em produção. Rejeitado.");
        await captureProductionError({
          service: "api-railway",
          context: "billing_webhook_security",
          error: new Error("Chave ASAAS_WEBHOOK_SECRET ausente em produção"),
        });
        return res.status(500).json({ error: "Configuração de webhook de faturamento incompleta" });
      }
      if (!incomingToken || incomingToken !== asaasSecret) {
        console.warn("[Billing Webhook Asaas] Token ausente ou inválido no header asaas-access-token. Rejeitado.");
        return res.status(401).json({ error: "Token de webhook inválido ou ausente" });
      }
    } else if (asaasSecret) {
      if (!incomingToken || incomingToken !== asaasSecret) {
        console.warn("[Billing Webhook Asaas Dev] Token de acesso inválido no header asaas-access-token. Rejeitado.");
        return res.status(401).json({ error: "Token de webhook inválido" });
      }
    }

    const body = req.body;
    const event = body?.event; // ex: PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_DELETED, SUBSCRIPTION_CANCELLED
    const externalReference = body?.payment?.externalReference || body?.externalReference;
    const customerEmail = body?.payment?.customerEmail || body?.customerEmail || body?.payment?.email;
    const customerId = body?.payment?.customer || body?.customer;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Billing Webhook Asaas] Evento: ${event} para cliente: ${maskEmail(customerEmail || customerId || "N/A")}`);
    }

    let org: any = null;

    if (externalReference) {
      org = await prisma.organization.findUnique({
        where: { id: externalReference },
      });
    }

    if (!org && customerEmail) {
      org = await prisma.organization.findFirst({
        where: {
          OR: [
            { emailNotificacoes: customerEmail },
            { users: { some: { email: customerEmail } } },
          ],
        },
      });
    }

    if (org) {
      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        await prisma.organization.update({
          where: { id: org.id },
          data: { statusPlano: "ativo" },
        });

        await prisma.auditLog.create({
          data: {
            organizationId: org.id,
            acao: "PAYMENT_CONFIRMED",
            detalhes: `Pagamento confirmado no Asaas. Assinatura ATIVA para ${org.nome}. Evento: ${event}`,
          },
        });
      } else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_BANK_SLIP_CANCELLED") {
        await prisma.organization.update({
          where: { id: org.id },
          data: { statusPlano: "inadimplente" },
        });

        await prisma.auditLog.create({
          data: {
            organizationId: org.id,
            acao: "PAYMENT_OVERDUE",
            detalhes: `Cobrança vencida no Asaas. Status atualizado para INADIMPLENTE para ${org.nome}. Evento: ${event}`,
          },
        });
      } else if (
        event === "PAYMENT_DELETED" ||
        event === "SUBSCRIPTION_CANCELLED" ||
        event === "SUBSCRIPTION_INACTIVATED" ||
        event === "PAYMENT_REFUNDED"
      ) {
        await prisma.organization.update({
          where: { id: org.id },
          data: { statusPlano: "cancelado" },
        });

        await prisma.auditLog.create({
          data: {
            organizationId: org.id,
            acao: "BILLING_SUBSCRIPTION_CANCELLED",
            detalhes: `Assinatura cancelada/estornada no Asaas para ${org.nome}. Evento: ${event}`,
          },
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Billing Webhook] Erro:", error);
    await captureProductionError({
      service: "api-railway",
      context: "billing_webhook_pipeline",
      error,
      metadata: { body: req.body },
    });
    return res.status(500).json({ error: "Internal server error" });
  }
});

