/**
 * ElevenLabs API Client
 * Gera áudios ultra-realistas humanizados com clonagem de voz para envio PTT no WhatsApp.
 */

export interface ElevenLabsVoiceOptions {
  voiceId?: string; // ID da voz clonada ou padrão (ex: Rachel, Adam, ou voz do corretor)
  stability?: number;
  similarityBoost?: number;
}

export async function synthesizeWithElevenLabs(
  text: string,
  options?: ElevenLabsVoiceOptions
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = options?.voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel default

  if (!apiKey) {
    console.warn("ELEVENLABS_API_KEY não configurada no .env.");
    return null;
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: options?.stability ?? 0.5,
          similarity_boost: options?.similarityBoost ?? 0.75,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erro no ElevenLabs:", err);
      return null;
    }

    return await res.arrayBuffer();
  } catch (error) {
    console.error("Falha ao sintetizar voz com ElevenLabs:", error);
    return null;
  }
}
