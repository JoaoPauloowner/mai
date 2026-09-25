/**
 * Monitoramento de Erros e Alertas em Produção (Apps / Web)
 */

export interface WebErrorContext {
  context: string;
  error: any;
  userId?: string;
  orgId?: string;
  metadata?: Record<string, any>;
}

export async function captureWebError({
  context,
  error,
  userId,
  orgId,
  metadata = {},
}: WebErrorContext): Promise<void> {
  const timestamp = new Date().toISOString();
  const errorMessage = error?.message || String(error);
  const stack = error?.stack ? error.stack.split("\n").slice(0, 5).join("\n") : "Sem stack";

  const payload = {
    service: "web-vercel",
    context,
    errorMessage,
    userId,
    orgId,
    timestamp,
    metadata,
    stack,
  };

  console.error(`🚨 [WEB_PROD_ERROR] [${context}]`, JSON.stringify(payload));

  const webhookUrl = process.env.ERROR_ALERT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🚨 **[ALERTA WEB VERCEL]** Falha na rota \`${context}\`\n**Erro:** \`${errorMessage}\`\n**Org:** \`${orgId || "N/A"}\` | **User:** \`${userId || "N/A"}\`\n**Data:** \`${timestamp}\``,
        }),
      });
    } catch (e) {
      console.error("[Monitoring Web] Falha no disparo de alerta:", e);
    }
  }
}
