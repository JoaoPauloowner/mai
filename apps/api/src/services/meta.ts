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
    const res = await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
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
    });

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

