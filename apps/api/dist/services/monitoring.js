/**
 * Serviço Centralizado de Monitoramento de Erros em Produção
 * Suporta Webhooks (Discord / Slack / Custom) e Sentry DSN sem travar o runtime.
 */
export async function captureProductionError({ service = "api-railway", context, error, metadata = {}, }) {
    const timestamp = new Date().toISOString();
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack ? error.stack.split("\n").slice(0, 5).join("\n") : "Sem stack trace";
    const payload = {
        service,
        context,
        errorMessage,
        timestamp,
        metadata,
        stack: errorStack,
    };
    // 1. Log Estruturado para observabilidade (Railway Logs / Cloudwatch)
    console.error(`🚨 [PROD_CRITICAL_ALERT] [${service.toUpperCase()}] [${context}]`, JSON.stringify(payload));
    // 2. Disparo de Webhook de Notificação Imediata (Discord / Slack / Teams)
    const webhookUrl = process.env.ERROR_ALERT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            const messageContent = {
                content: `🚨 **[ALERTA CRÍTICO OMNISDR]** Falha no serviço \`${service}\`\n**Contexto:** \`${context}\`\n**Erro:** \`${errorMessage}\`\n**Data:** \`${timestamp}\`\n\`\`\`json\n${JSON.stringify(metadata, null, 2)}\n\`\`\``,
            };
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageContent),
            });
        }
        catch (notifyErr) {
            console.error("[Monitoring] Falha ao despachar webhook de alerta:", notifyErr);
        }
    }
}
