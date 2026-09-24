"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
const database_1 = require("@omni/database");
const meta_js_1 = require("../services/meta.js");
const ai_js_1 = require("../services/ai.js");
const conversation_js_1 = require("../services/conversation.js");
exports.webhookRouter = (0, express_1.Router)();
// 1. Meta Webhook Handshake (WhatsApp & Instagram)
exports.webhookRouter.get("/whatsapp", (req, res) => {
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
exports.webhookRouter.post("/whatsapp", async (req, res) => {
    // Validação de HMAC com META_APP_SECRET (Falha fechada em produção)
    const signature = req.headers["x-hub-signature-256"];
    const appSecret = process.env.META_APP_SECRET;
    if (process.env.NODE_ENV === "production") {
        if (!appSecret) {
            console.error("[Webhook WhatsApp CRITICAL] META_APP_SECRET não está configurado em produção. Rejeitando requisição.");
            return res.status(500).json({ error: "Configuração de segurança incompleta" });
        }
        if (!signature || !(0, meta_js_1.verifyMetaSignature)(JSON.stringify(req.body), signature, appSecret)) {
            console.warn("[Webhook WhatsApp] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
            return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
        }
    }
    else if (appSecret && signature) {
        if (!(0, meta_js_1.verifyMetaSignature)(JSON.stringify(req.body), signature, appSecret)) {
            console.warn("[Webhook WhatsApp Dev] Assinatura HMAC inválida.");
            return res.status(401).json({ error: "Assinatura HMAC inválida" });
        }
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
            if (!senderPhone || !messageText)
                return;
            console.log(`[Webhook WhatsApp] Mensagem recebida de ${senderPhone}: "${messageText}"`);
            // 1. Identificar a Organização dona do número
            const org = (await database_1.prisma.organization.findFirst({
                where: { metaPhoneNumberId: phoneNumberId },
            })) ||
                (await database_1.prisma.organization.findFirst()); // Fallback para a primeira organização para testes
            if (!org) {
                console.warn("[Webhook WhatsApp] Nenhuma organização encontrada para este número.");
                return;
            }
            // 2. Criar ou recuperar Lead e Conversa no banco
            const contactName = value?.contacts?.[0]?.profile?.name || `Lead ${senderPhone.slice(-4)}`;
            const { lead, conversation } = await (0, conversation_js_1.findOrCreateLeadAndConversation)({
                organizationId: org.id,
                phone: senderPhone,
                name: contactName,
                channel: "WHATSAPP",
            });
            // 3. Registrar mensagem de entrada
            await (0, conversation_js_1.recordIncomingMessage)({
                conversationId: conversation.id,
                text: messageText,
            });
            // 4. Buscar histórico recente da conversa
            const history = await (0, conversation_js_1.getRecentHistory)(conversation.id);
            // 5. Executar o Motor de IA (RAG + GPT-4o-mini + Function Calling)
            const { replyText, toolCalled } = await (0, ai_js_1.generateSDRResponse)({
                organizationId: org.id,
                leadId: lead.id,
                leadName: lead.nome,
                leadPhone: lead.telefone,
                userMessage: messageText,
                history,
            });
            console.log(`[Webhook WhatsApp] Resposta gerada pela IA (Tool: ${toolCalled || "none"}): "${replyText}"`);
            // 6. Registrar resposta de saída no banco
            await (0, conversation_js_1.recordOutgoingMessage)({
                conversationId: conversation.id,
                text: replyText,
            });
            // 7. Enviar mensagem de volta ao cliente via Meta Graph API v20.0
            const metaToken = org.metaAccessToken || process.env.META_ACCESS_TOKEN;
            const targetPhoneId = org.metaPhoneNumberId || phoneNumberId || process.env.META_PHONE_NUMBER_ID;
            if (metaToken && targetPhoneId) {
                const sendResult = await (0, meta_js_1.sendWhatsAppMessage)({
                    phoneNumberId: targetPhoneId,
                    accessToken: metaToken,
                    to: senderPhone,
                    text: replyText,
                });
                console.log(`[Webhook WhatsApp] Disparo Graph API: ${sendResult.success ? "Sucesso" : "Falha: " + sendResult.error}`);
            }
            else {
                console.log(`[Webhook WhatsApp (Simulação Local)] Resposta gravada no banco. Configure META_ACCESS_TOKEN para envio real.`);
            }
        }
        catch (error) {
            console.error("[Webhook WhatsApp] Erro no processamento em background:", error);
        }
    })();
});
// 3. Instagram Direct Webhook Handshake & Dispatcher
exports.webhookRouter.get("/instagram", (req, res) => {
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
exports.webhookRouter.post("/instagram", async (req, res) => {
    // Validação de HMAC com META_APP_SECRET (Falha fechada em produção)
    const signature = req.headers["x-hub-signature-256"];
    const appSecret = process.env.META_APP_SECRET;
    if (process.env.NODE_ENV === "production") {
        if (!appSecret) {
            console.error("[Webhook Instagram CRITICAL] META_APP_SECRET não está configurado em produção. Rejeitando requisição.");
            return res.status(500).json({ error: "Configuração de segurança incompleta" });
        }
        if (!signature || !(0, meta_js_1.verifyMetaSignature)(JSON.stringify(req.body), signature, appSecret)) {
            console.warn("[Webhook Instagram] Assinatura HMAC X-Hub-Signature-256 ausente ou inválida. Requisição rejeitada.");
            return res.status(401).json({ error: "Assinatura HMAC inválida ou ausente" });
        }
    }
    else if (appSecret && signature) {
        if (!(0, meta_js_1.verifyMetaSignature)(JSON.stringify(req.body), signature, appSecret)) {
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
            const org = (await database_1.prisma.organization.findFirst()) || { id: "default_org" };
            const { lead, conversation } = await (0, conversation_js_1.findOrCreateLeadAndConversation)({
                organizationId: org.id,
                phone: senderId,
                name: `Instagram User ${senderId.slice(-4)}`,
                channel: "INSTAGRAM_DIRECT",
            });
            await (0, conversation_js_1.recordIncomingMessage)({ conversationId: conversation.id, text: messageText });
            const history = await (0, conversation_js_1.getRecentHistory)(conversation.id);
            const { replyText } = await (0, ai_js_1.generateSDRResponse)({
                organizationId: org.id,
                leadId: lead.id,
                leadName: lead.nome,
                leadPhone: lead.telefone,
                userMessage: messageText,
                history,
            });
            await (0, conversation_js_1.recordOutgoingMessage)({ conversationId: conversation.id, text: replyText });
            const metaToken = process.env.META_ACCESS_TOKEN;
            if (metaToken) {
                await (0, meta_js_1.sendInstagramMessage)({
                    pageId: recipientId,
                    accessToken: metaToken,
                    recipientId: senderId,
                    text: replyText,
                });
            }
        }
        catch (error) {
            console.error("[Webhook Instagram] Erro:", error);
        }
    })();
});
// 4. Voice Agent Webhook (Vapi / Bland / ElevenLabs)
exports.webhookRouter.post("/voice", async (req, res) => {
    try {
        const body = req.body;
        console.log("[Webhook Voice] Evento recebido:", JSON.stringify(body).slice(0, 150));
        return res.status(200).json({ status: "success" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
// 5. Billing Webhook (Asaas com Verificação de Token & AuditLog - Falha Fechada em Produção)
exports.webhookRouter.post("/billing", async (req, res) => {
    try {
        const asaasSecret = process.env.ASAAS_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_ACCESS_TOKEN;
        const incomingToken = req.headers["asaas-access-token"];
        if (process.env.NODE_ENV === "production") {
            if (!asaasSecret) {
                console.error("[Billing Webhook CRITICAL] ASAAS_WEBHOOK_SECRET / ASAAS_WEBHOOK_ACCESS_TOKEN ausente em produção. Rejeitado.");
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
        const event = body?.event; // ex: PAYMENT_RECEIVED, PAYMENT_OVERDUE
        const customerEmail = body?.payment?.customerEmail || body?.customer;
        if (process.env.NODE_ENV !== "production") {
            console.log(`[Billing Webhook Asaas] Evento: ${event} para cliente: ${customerEmail}`);
        }
        if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
            const org = await database_1.prisma.organization.findFirst({
                where: { emailNotificacoes: customerEmail },
            });
            if (org) {
                await database_1.prisma.organization.update({
                    where: { id: org.id },
                    data: { statusPlano: "ativo" },
                });
                // Grava no AuditLog (Item 8)
                await database_1.prisma.auditLog.create({
                    data: {
                        organizationId: org.id,
                        acao: "PAYMENT_CONFIRMED",
                        detalhes: `Pagamento recebido via Asaas. Plano reativado para a organização ${org.nome}. Evento: ${event}`,
                    },
                });
            }
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
