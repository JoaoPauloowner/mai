/**
 * Meta Conversions API (CAPI) Client
 * Envia eventos de conversão (Lead, Purchase, Schedule) de volta para o Pixel da Meta.
 */

export interface MetaConversionPayload {
  eventName: "Lead" | "Purchase" | "Schedule" | "Contact";
  eventTime?: number;
  phoneHash: string; // SHA-256 do telefone normalizado
  emailHash?: string; // SHA-256 do email normalizado
  value?: number;
  currency?: string;
  customData?: Record<string, any>;
}

export async function sendMetaConversionEvent(
  pixelId: string,
  accessToken: string,
  payload: MetaConversionPayload
): Promise<boolean> {
  if (!pixelId || !accessToken) {
    console.warn("Pixel ID ou Meta Access Token não configurados para CAPI.");
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;

    const eventData = {
      event_name: payload.eventName,
      event_time: payload.eventTime || Math.floor(Date.now() / 1000),
      action_source: "system_generated",
      user_data: {
        ph: [payload.phoneHash],
        ...(payload.emailHash ? { em: [payload.emailHash] } : {}),
      },
      custom_data: {
        value: payload.value || 0,
        currency: payload.currency || "BRL",
        ...payload.customData,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventData],
        access_token: accessToken,
      }),
    });

    const data = await res.json();
    return Boolean(data.events_received);
  } catch (error) {
    console.error("Falha ao enviar evento Meta CAPI:", error);
    return false;
  }
}
