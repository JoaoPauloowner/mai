"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
exports.webhookRouter = (0, express_1.Router)();
// 1. Meta Webhook Handshake (WhatsApp & Instagram)
exports.webhookRouter.get("/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "omni_verify_token_2026";
    if (mode === "subscribe" && token === verifyToken) {
        console.log("[Webhook WhatsApp] Handshake verificado com sucesso!");
        return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: "Token de verificação inválido" });
});
// 2. WhatsApp Incoming Messages Webhook (Processamento Assíncrono sem Timeout)
exports.webhookRouter.post("/whatsapp", async (req, res) => {
    // Responde imediatamente 200 OK para a Meta não reenviar nem dar timeout
    res.status(200).json({ status: "received" });
    try {
        const body = req.body;
        console.log("[Webhook WhatsApp] Mensagem recebida:", JSON.stringify(body).slice(0, 200));
        // O processamento pesado de IA (RAG + OpenAI + Whisper + ElevenLabs)
        // é executado em background no Railway
    }
    catch (error) {
        console.error("[Webhook WhatsApp] Erro no processamento assíncrono:", error);
    }
});
// 3. Instagram Direct Webhook
exports.webhookRouter.get("/instagram", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "omni_verify_token_2026";
    if (mode === "subscribe" && token === verifyToken) {
        console.log("[Webhook Instagram] Handshake verificado com sucesso!");
        return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: "Token de verificação inválido" });
});
exports.webhookRouter.post("/instagram", async (req, res) => {
    res.status(200).json({ status: "received" });
    try {
        const body = req.body;
        console.log("[Webhook Instagram] Evento recebido:", JSON.stringify(body).slice(0, 200));
    }
    catch (error) {
        console.error("[Webhook Instagram] Erro no processamento assíncrono:", error);
    }
});
// 4. Voice Agent Webhook (Vapi / Bland / ElevenLabs Conversational)
exports.webhookRouter.post("/voice", async (req, res) => {
    try {
        const body = req.body;
        console.log("[Webhook Voice] Evento de chamada recebido:", JSON.stringify(body).slice(0, 200));
        return res.status(200).json({ status: "success" });
    }
    catch (error) {
        console.error("[Webhook Voice] Erro:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// 5. Billing Webhook (Stripe / Asaas / Mercado Pago)
exports.webhookRouter.post("/billing", async (req, res) => {
    try {
        const body = req.body;
        console.log("[Webhook Billing] Evento de pagamento:", JSON.stringify(body).slice(0, 200));
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("[Webhook Billing] Erro:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
