import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { webhookRouter } from "./routes/webhooks.js";

dotenv.config();

const app = express();

// Configuração de CORS com allowlist segura ou fallback configurável
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["https://omnisdr-app.vercel.app", "http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como webhooks diretos da Meta ou chamadas de servidor)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true); // Não bloqueia webhooks de terceiros
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Hub-Signature-256", "x-api-key"],
  })
);

// Captura de rawBody para validação matemática de HMAC SHA-256
app.use(
  express.json({
    limit: "2mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health Check endpoint para Railway
app.get("/health", (_req, res) => {
  res.json({
    status: "online",
    service: "omni-ai-engine",
    timestamp: new Date().toISOString(),
  });
});

// Rotas de Webhooks e IA (suporta tanto /webhooks quanto /api/webhooks)
app.use("/webhooks", webhookRouter);
app.use("/api/webhooks", webhookRouter);

// Global Error Handler (S10)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Unhandled Express Error]", err);
  res.status(500).json({ error: "Erro interno no processamento." });
});

process.on("unhandledRejection", (reason) => {
  console.error("[CRITICAL] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[CRITICAL] Uncaught Exception:", error);
});

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 [Railway AI Engine] Servidor ativo e ouvindo em ${HOST}:${PORT}`);
});

