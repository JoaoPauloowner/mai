import crypto from "crypto";
import { prisma } from "@omni/database";
import { fetchWithTimeout } from "./circuit-breaker.js";

export interface SendWhatsAppParams {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  text: string;
  organizationId?: string;
}

export interface SendInstagramParams {
  pageId: string;
  accessToken: string;
  recipientId: string;
  text: string;
}

/**
 * Verifica se um erro retornado pela Graph API da Meta indica token expirado ou inválido (código 190 / OAuthException).
 */
export function isMetaTokenExpired(errorData: any): boolean {
  if (!errorData) return false;
  const err = errorData?.error || errorData;
  const code = Number(err?.code);
  const subcode = Number(err?.error_subcode);
  const message = String(err?.message || "");

  return (
    code === 190 ||
    subcode === 463 ||
    subcode === 467 ||
    message.includes("Session has expired") ||
    message.includes("Error validating access token") ||
    message.includes("The access token could not be decrypted") ||
    message.includes("Malformed access token")
  );
}

// 1. Validação de HMAC SHA-256 no Header X-Hub-Signature-256
export function verifyMetaSignature(
  rawBody: string | Buffer,
  signatureHeader: string | undefined,
  appSecret: string | undefined
): boolean {
  if (!appSecret) {
    // Se META_APP_SECRET não estiver configurado em desenvolvimento, permite teste com aviso
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    return false;
  }

  if (!signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split("sha256=");
  if (parts.length !== 2) {
    return false;
  }

  const signature = parts[1];
  try {
    const hmac = crypto.createHmac("sha256", appSecret);
    const digest = hmac.update(rawBody).digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const digestBuf = Buffer.from(digest, "hex");

    if (sigBuf.length !== digestBuf.length || sigBuf.length === 0) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuf, digestBuf);
  } catch {
    return false;
  }
}

// Utilitário para resolver variações de formato de telefone WhatsApp (especialmente a regra do 9º dígito no Brasil)
export function formatWhatsAppRecipientCandidates(phone: string): string[] {
  const clean = phone.replace(/\D/g, "");

  // Regra do 9º dígito do Brasil (+55 + 2 dígitos DDD + 8 dígitos móvel => prioriza +55 + DDD + 9 + 8 dígitos)
  if (clean.startsWith("55") && clean.length === 12) {
    const ddd = clean.slice(2, 4);
    const rest = clean.slice(4);
    if (["6", "7", "8", "9"].includes(rest[0])) {
      const withNine = `55${ddd}9${rest}`;
      return [withNine, clean];
    }
  }

  // Se já tem 13 dígitos no Brasil (55 + DDD + 9 + 8 dígitos)
  if (clean.startsWith("55") && clean.length === 13) {
    const ddd = clean.slice(2, 4);
    const ninth = clean[4];
    const rest = clean.slice(5);
    if (ninth === "9") {
      const withoutNine = `55${ddd}${rest}`;
      return [clean, withoutNine];
    }
  }

  return [clean];
}

// 2. Envio de mensagem de texto via Meta WhatsApp Cloud API v20.0
export async function sendWhatsAppMessage({
  phoneNumberId,
  accessToken,
  to,
  text,
  organizationId,
}: SendWhatsAppParams): Promise<{ success: boolean; data?: any; error?: string; isTokenExpired?: boolean }> {
  try {
    const candidates = formatWhatsAppRecipientCandidates(to);
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    let lastData: any = null;
    let success = false;

    for (const targetPhone of candidates) {
      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: targetPhone,
          type: "text",
          text: { preview_url: false, body: text },
        }),
      }, 15000);

      const data = await res.json();
      lastData = data;

      if (res.ok) {
        success = true;
        return { success: true, data };
      }

      console.error(`[Meta API WhatsApp] Erro no envio para ${targetPhone}:`, data);
      if (data?.error?.code === 131030) {
        console.warn(`[Meta API Sandbox] Destinatário ${targetPhone} não está na lista de permissão. Tentando próximo formato se houver...`);
      }
    }

    const data = lastData;
    const tokenExpired = isMetaTokenExpired(data);

      if (tokenExpired) {
        console.warn(`[Meta API Token Expired] Token inválido ou expirado para Phone ID ${phoneNumberId}. Atualizando status para DISCONNECTED.`);
        try {
          if (organizationId) {
            await prisma.organization.update({
              where: { id: organizationId },
              data: { whatsappStatus: "DISCONNECTED" },
            });
            await prisma.auditLog.create({
              data: {
                organizationId,
                acao: "WHATSAPP_TOKEN_EXPIRED",
                detalhes: `Token da Meta Graph API expirado/inválido (código 190). Canal WhatsApp marcado como DISCONNECTED.`,
              },
            });
          } else if (phoneNumberId) {
            const orgs = await prisma.organization.findMany({
              where: { metaPhoneNumberId: phoneNumberId },
              select: { id: true },
            });
            for (const org of orgs) {
              await prisma.organization.update({
                where: { id: org.id },
                data: { whatsappStatus: "DISCONNECTED" },
              });
              await prisma.auditLog.create({
                data: {
                  organizationId: org.id,
                  acao: "WHATSAPP_TOKEN_EXPIRED",
                  detalhes: `Token da Meta Graph API expirado/inválido (código 190) para Phone ID ${phoneNumberId}. Canal WhatsApp marcado como DISCONNECTED.`,
                },
              });
            }
          }
        } catch (dbErr) {
          console.error("[Meta API WhatsApp] Falha ao persistir status DISCONNECTED no banco:", dbErr);
        }
      }

    return {
      success: false,
      error: data?.error?.message || "Erro desconhecido da Meta API",
      isTokenExpired: tokenExpired,
    };
  } catch (error: any) {
    console.error("[Meta API WhatsApp] Falha na requisição:", error);
    return { success: false, error: error.message };
  }
}

// 3. Envio de mensagem direta no Instagram Direct via Meta Graph API v20.0
export async function sendInstagramMessage({
  accessToken,
  recipientId,
  text,
}: SendInstagramParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v20.0/me/messages`;

    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    }, 15000);

    const data = await res.json();

    return { success: true, data };
  } catch (error: any) {
    console.error("[Meta API Instagram] Falha na requisição:", error);
    return { success: false, error: error.message };
  }
}

// 4. Envio de mensagem de texto via Evolution API v2 (Baileys / QR Code)
export async function sendEvolutionWhatsAppMessage({
  instanceName,
  to,
  text,
}: {
  instanceName: string;
  to: string;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  const evolutionUrl = process.env.EVOLUTION_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!evolutionUrl || !apiKey) {
    return { success: false, error: "EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados." };
  }

  const cleanPhone = to.replace(/\D/g, "");

  try {
    const res = await fetchWithTimeout(`${evolutionUrl}/message/sendText/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: cleanPhone,
        text,
        delay: 1200,
      }),
    }, 15000);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[Evolution API WhatsApp] Erro no envio:", errData);
      return { success: false, error: JSON.stringify(errData) };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[Evolution API WhatsApp] Falha na requisição:", error);
    return { success: false, error: error.message };
  }
}


