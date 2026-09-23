import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { webhookRouter } from "./routes/webhooks.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Configuração de CORS para permitir requisições do frontend Vercel
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health Check endpoint para Railway
app.get("/health", (_req, res) => {
  res.json({
    status: "online",
    service: "omni-ai-engine",
    timestamp: new Date().toISOString(),
  });
});

// Rotas de Webhooks e IA
app.use("/api/webhooks", webhookRouter);

app.listen(port, () => {
  console.log(`🚀 [Railway AI Engine] Servidor ativo e ouvindo na porta ${port}`);
});
