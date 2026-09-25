/**
 * Conector Oficial Evolution API v2 (WhatsApp QR Code Microservice)
 * Gerencia criação de instâncias, geração de QR Code e envio de mensagens.
 */

export interface EvolutionQrCodeResponse {
  instanceName: string;
  status: "qrcode" | "connected" | "connecting" | "error";
  qrcodeBase64?: string; // Imagem base64 do QR Code para renderizar no <img src="..." />
  code?: string; // Código de pareamento numérico (se preferir)
  error?: string;
}

export async function createOrFetchInstanceQrCode(
  instanceName: string
): Promise<EvolutionQrCodeResponse> {
  const evolutionUrl = process.env.EVOLUTION_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.EVOLUTION_API_KEY;
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/whatsapp`;

  if (!evolutionUrl || !apiKey) {
    return {
      instanceName,
      status: "error",
      error: "EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados nas variáveis de ambiente.",
    };
  }

  try {
    // 1. Tenta criar a instância com Webhook configurado
    const createRes = await fetch(`${evolutionUrl}/instance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        instanceName,
        token: apiKey,
        integration: "WHATSAPP-BAILEYS",
        qrcode: true,
        webhook: {
          url: webhookUrl,
          byEvents: false,
          base64: true,
          events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
        },
      }),
    });

    // 2. Busca o estado de conexão e QR Code
    const connectRes = await fetch(`${evolutionUrl}/instance/connect/${instanceName}`, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    });

    if (connectRes.ok) {
      const data = await connectRes.json();
      if (data.base64) {
        return {
          instanceName,
          status: "qrcode",
          qrcodeBase64: data.base64,
          code: data.code,
        };
      } else if (data.instance?.state === "open" || data.state === "open") {
        return {
          instanceName,
          status: "connected",
        };
      }
    }

    return {
      instanceName,
      status: "connecting",
    };
  } catch (error: any) {
    console.error("Falha ao comunicar com Evolution API:", error);
    return {
      instanceName,
      status: "error",
      error: error.message,
    };
  }
}

/**
 * Envio de Mensagem de Texto via Evolution API
 */
export async function sendWhatsAppMessageEvolution(
  instanceName: string,
  toPhone: string,
  text: string
): Promise<boolean> {
  const evolutionUrl = process.env.EVOLUTION_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!evolutionUrl || !apiKey) return false;

  const cleanPhone = toPhone.replace(/\D/g, "");

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

    return res.ok;
  } catch (error) {
    console.error("Erro ao enviar mensagem via Evolution API:", error);
    return false;
  }
}
