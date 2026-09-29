import crypto from "crypto";

interface SendVerificationEmailParams {
  to: string;
  nome: string;
  code: string;
  token: string;
  appUrl?: string;
}

export function generateEmailToken(): { token: string; code: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString("hex");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas de validade
  return { token, code, expiresAt };
}

/**
 * Envia e-mail transacional de confirmação de conta via Resend ou fallback configurado
 */
export async function sendVerificationEmail({
  to,
  nome,
  code,
  token,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://omnisdr-app.vercel.app",
}: SendVerificationEmailParams): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const cleanAppUrl = appUrl.replace(/\/+$/, "");
  const verificationLink = `${cleanAppUrl}/verificar-email?token=${token}&email=${encodeURIComponent(to)}`;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "OMNAI <onboarding@resend.dev>";

  // Template HTML profissional e responsivo
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #172b4d; }
        .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #0f172a; padding: 32px 24px; text-align: center; }
        .logo { color: #00ddd7; font-size: 24px; font-weight: bold; letter-spacing: -0.5px; }
        .content { padding: 32px 24px; }
        .code-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; padding: 18px; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a; font-family: monospace; }
        .btn { display: inline-block; width: 100%; box-sizing: border-box; background: #00ddd7; color: #091e42 !important; font-weight: 700; text-decoration: none; padding: 14px 24px; border-radius: 6px; text-align: center; font-size: 15px; margin-top: 16px; }
        .footer { padding: 20px 24px; background: #fafbfc; border-top: 1px solid #edf2f7; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ OMNAI</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 4px; letter-spacing: 1px;">MOTOR MAI • ATENDIMENTO INTELIGENTE</div>
        </div>
        <div class="content">
          <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Olá, ${nome || "bem-vindo"}! 👋</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Obrigado por criar sua conta no <strong>OMNAI</strong>. Para ativar seu workspace com segurança e verificar a veracidade deste e-mail, utilize o código abaixo:
          </p>
          
          <div class="code-box">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 6px;">Seu Código de Ativação</div>
            <div class="otp-code">${code}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Válido por 24 horas</div>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Ou, se preferir, ative diretamente com 1 clique no botão abaixo:
          </p>

          <a href="${verificationLink}" class="btn" target="_blank">Ativar Minha Conta Agora →</a>
        </div>
        <div class="footer">
          Se você não solicitou este cadastro, ignore este e-mail com segurança.<br/>
          © ${new Date().getFullYear()} OMNAI Platform. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Envio real via Resend API (se chave configurada)
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: `🔒 ${code} é o seu código de ativação OMNAI`,
          html: htmlContent,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        console.error("[Email Resend Error]", resData);
        return { success: false, error: resData.message || "Erro no envio do e-mail." };
      }

      return { success: true };
    } catch (err: any) {
      console.error("[Email Dispatch Exception]", err);
      return { success: false, error: err.message };
    }
  }

  // 2. Modo Desenvolvimento / Sem API Key configurada
  const { maskEmail } = await import("@/lib/mask");
  console.log(`\n========================================`);
  console.log(`[EMAIL DEV MODE] Para: ${maskEmail(to)}`);
  console.log(`[EMAIL DEV MODE] Código: ${code}`);
  console.log(`[EMAIL DEV MODE] Link de Ativação: ${verificationLink}`);
  console.log(`========================================\n`);

  return { success: true, devMode: true };
}
