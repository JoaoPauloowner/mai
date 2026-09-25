import { Router } from "express";
import { prisma } from "@omni/database";
import { verifyMetaSignature, sendWhatsAppMessage, sendInstagramMessage } from "../services/meta.js";
import { generateSDRResponse } from "../services/ai.js";
import { findOrCreateLeadAndConversation, recordIncomingMessage, recordOutgoingMessage, getRecentHistory } from "../services/conversation.js";
import { captureProductionError } from "../services/monitoring.js";
export const webhookRouter = Router();
// 1. Meta Webhook Handshake (WhatsApp & Instagram)
webhookRouter.get("/whatsapp", (req, res) => {
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
webhookRouter.post("/whatsapp", async (req, res) => {
    const isEvolutionEvent = Boolean(req.body?.event === "messages.upsert" || req.body?.data?.key || req.body?.instance);
    const signature = req.headers["x-hub-signature-256"];
    const appSecret = process.env.META_APP_SECRET;
    // Se for evento Meta Cloud API, valida assinatura HMAC
    if (!isEvolutionEvent) {
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
            if (!signature || !verifyMetaSignature(JSON.stringify(req.body), signature, appSecret)) {
                console.warn("[Webhook WhatsApp] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
                return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
            }
        }
        else if (appSecret && signature) {
            if (!verifyMetaSignature(JSON.stringify(req.body), signature, appSecret)) {
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
            // ==========================================
            // A) PROCESSAMENTO EVOLUTION API v2 (QR CODE)
            // ==========================================
            if (isEvolutionEvent) {
                const data = body.data || body;
                const key = data.key;
                if (!key || key.fromMe)
                    return; // Ignora mensagens enviadas pelo próprio bot
                const senderPhone = (key.remoteJid || "").replace(/@.*$/, "");
                const contactName = data.pushName || `Lead ${senderPhone.slice(-4)}`;
                const messageText = (data.message?.conversation || data.message?.extendedTextMessage?.text || "").trim();
                const instanceName = body.instance || "omni_demo";
                if (!senderPhone || !messageText)
                    return;
                console.log(`[Webhook Evolution API] Mensagem de ${senderPhone} (${contactName}): "${messageText}"`);
                const orgSlug = instanceName.replace(/^omni_/, "");
                const org = (await prisma.organization.findFirst({
                    where: { OR: [{ slug: orgSlug }, { whatsappTipoConexao: "QR_CODE" }] },
                })) ||
                    (await prisma.organization.findFirst());
                if (!org)
                    return;
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
            const message = value?.messages?.[0];
            if (!message || message.type !== "text") {
                return;
            }
            const senderPhone = message.from;
            const messageText = message.text?.body?.trim();
            const phoneNumberId = value.metadata?.phone_number_id;
            if (!senderPhone || !messageText)
                return;
            console.log(`[Webhook WhatsApp Meta] Mensagem recebida de ${senderPhone}: "${messageText}"`);
            const org = (await prisma.organization.findFirst({
                where: { metaPhoneNumberId: phoneNumberId },
            })) ||
                (await prisma.organization.findFirst());
            if (!org) {
                console.warn("[Webhook WhatsApp] Nenhuma organização encontrada para este número.");
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
            const history = await getRecentHistory(conversation.id);
            const { replyText, toolCalled } = await generateSDRResponse({
                organizationId: org.id,
                leadId: lead.id,
                leadName: lead.nome,
                leadPhone: lead.telefone,
                userMessage: messageText,
                history,
            });
            console.log(`[Webhook WhatsApp Meta] Resposta gerada (Tool: ${toolCalled || "none"}): "${replyText}"`);
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
                });
                console.log(`[Webhook WhatsApp Meta] Disparo Graph API: ${sendResult.success ? "Sucesso" : "Falha: " + sendResult.error}`);
            }
        }
        catch (error) {
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
webhookRouter.get("/instagram", (req, res) => {
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
webhookRouter.post("/instagram", async (req, res) => {
    // Validação de HMAC com META_APP_SECRET (Falha fechada em produção)
    const signature = req.headers["x-hub-signature-256"];
    const appSecret = process.env.META_APP_SECRET;
    if (process.env.NODE_ENV === "production") {
        if (!appSecret) {
            console.error("[Webhook Instagram CRITICAL] META_APP_SECRET não está configurado em produção. Rejeitando requisição.");
            return res.status(500).json({ error: "Configuração de segurança incompleta" });
        }
        if (!signature || !verifyMetaSignature(JSON.stringify(req.body), signature, appSecret)) {
            console.warn("[Webhook Instagram] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
            return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
        }
    }
    else if (appSecret && signature) {
        if (!verifyMetaSignature(JSON.stringify(req.body), signature, appSecret)) {
            return res.status(401).json({ error: "Assinatura HMAC inválida" });
        }
    }
    res.status(200).json({ status: "received" });
    (async () => {
        try {
            const body = req.body;
            const entry = body?.entry?.[0];
            const messaging = entry?.messaging?.[0];
            if (!messaging || !messaging.message?.text)
                return;
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
        }
        catch (error) {
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
webhookRouter.post("/voice", async (req, res) => {
    try {
        const body = req.body;
        console.log("[Webhook Voice] Evento recebido:", JSON.stringify(body).slice(0, 150));
        return res.status(200).json({ status: "success" });
    }
    catch (error) {
        await captureProductionError({
            service: "api-railway",
            context: "voice_agent_webhook",
            error,
        });
        return res.status(500).json({ error: "Internal server error" });
    }
});
// 5. Billing Webhook (Asaas com Verificação de Token & AuditLog - Falha Fechada em Produção)
webhookRouter.post("/billing", async (req, res) => {
    try {
        const asaasSecret = process.env.ASAAS_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_ACCESS_TOKEN;
        const incomingToken = req.headers["asaas-access-token"];
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
        }
        else if (asaasSecret) {
            if (!incomingToken || incomingToken !== asaasSecret) {
                console.warn("[Billing Webhook Asaas Dev] Token de acesso inválido no header asaas-access-token. Rejeitado.");
                return res.status(401).json({ error: "Token de webhook inválido" });
            }
        }
        const body = req.body;
        const event = body?.event; // ex: PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_DELETED
        const customerEmail = body?.payment?.customerEmail || body?.customer;
        if (process.env.NODE_ENV !== "production") {
            console.log(`[Billing Webhook Asaas] Evento: ${event} para cliente: ${customerEmail}`);
        }
        const org = await prisma.organization.findFirst({
            where: { emailNotificacoes: customerEmail },
        });
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
                        detalhes: `Pagamento recebido via Asaas. Plano ativado para a organização ${org.nome}. Evento: ${event}`,
                    },
                });
            }
            else if (event === "PAYMENT_OVERDUE") {
                await prisma.organization.update({
                    where: { id: org.id },
                    data: { statusPlano: "inadimplente" },
                });
                await prisma.auditLog.create({
                    data: {
                        organizationId: org.id,
                        acao: "PAYMENT_OVERDUE",
                        detalhes: `Fatura vencida via Asaas. Status alterado para inadimplente para ${org.nome}.`,
                    },
                });
            }
            else if (event === "PAYMENT_DELETED" || event === "SUBSCRIPTION_CANCELLED") {
                await prisma.auditLog.create({
                    data: {
                        organizationId: org.id,
                        acao: "BILLING_SUBSCRIPTION_CANCELLED",
                        detalhes: `Cobrança/assinatura cancelada no Asaas para ${org.nome}. Evento: ${event}`,
                    },
                });
            }
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
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
