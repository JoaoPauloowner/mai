"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const webhooks_js_1 = require("./routes/webhooks.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Configuração de CORS para permitir requisições do frontend Vercel
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// Health Check endpoint para Railway
app.get("/health", (_req, res) => {
    res.json({
        status: "online",
        service: "omni-ai-engine",
        timestamp: new Date().toISOString(),
    });
});
// Rotas de Webhooks e IA (suporta tanto /webhooks quanto /api/webhooks)
app.use("/webhooks", webhooks_js_1.webhookRouter);
app.use("/api/webhooks", webhooks_js_1.webhookRouter);
const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`🚀 [Railway AI Engine] Servidor ativo e ouvindo em ${HOST}:${PORT}`);
});
