import crypto from "crypto";

export interface SendWhatsAppParams {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  text: string;
}

export interface SendInstagramParams {
  pageId: string;
  accessToken: string;
  recipientId: string;
  text: string;
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
  const hmac = crypto.createHmac("sha256", appSecret);
  const digest = hmac.update(rawBody).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(digest, "hex"));
}

// 2. Envio de mensagem de texto via Meta WhatsApp Cloud API v20.0
export async function sendWhatsAppMessage({
  phoneNumberId,
  accessToken,
  to,
  text,
}: SendWhatsAppParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cleanTo = to.replace(/\D/g, "");
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanTo,
        type: "text",
        text: { preview_url: false, body: text },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Meta API WhatsApp] Erro no envio:", data);
      return { success: false, error: data?.error?.message || "Erro desconhecido da Meta API" };
    }

    return { success: true, data };
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

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Meta API Instagram] Erro no envio:", data);
      return { success: false, error: data?.error?.message || "Erro na API do Instagram" };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[Meta API Instagram] Falha na requisição:", error);
    return { success: false, error: error.message };
  }
}
