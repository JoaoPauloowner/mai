/**
 * OpenAI API Client
 * Suporta Chat Completion (GPT-4o / GPT-4o-mini), Transcrição de Áudio (Whisper) e Síntese de Voz (TTS).
 */

export interface OpenAiChatOptions {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
}

export async function generateWithOpenAi(
  prompt: string,
  options?: OpenAiChatOptions
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "[OpenAI]: Chave de API OPENAI_API_KEY não configurada no .env.";
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || "gpt-4o-mini",
        messages: [
          ...(options?.systemPrompt
            ? [{ role: "system", content: options.systemPrompt }]
            : []),
          { role: "user", content: prompt },
        ],
        temperature: options?.temperature ?? 0.4,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erro na API da OpenAI:", err);
      return `Erro OpenAI (${res.status}): Não foi possível processar.`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Sem resposta da OpenAI.";
  } catch (error: any) {
    console.error("Falha ao chamar OpenAI:", error);
    return `Erro de conexão com OpenAI: ${error.message}`;
  }
}

/**
 * Transcrição de Áudio com Whisper da OpenAI
 */
export async function transcribeAudioWithWhisper(
  audioBuffer: Buffer,
  fileName = "audio.ogg"
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "[Whisper]: OPENAI_API_KEY não configurada para transcrição.";
  }

  try {
    const formData = new FormData();
    const uint8 = new Uint8Array(audioBuffer);
    const blob = new Blob([uint8], { type: "audio/ogg" });
    formData.append("file", blob, fileName);
    formData.append("model", "whisper-1");
    formData.append("language", "pt");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const data = await res.json();
    return data.text || "Áudio inaudível ou vazio.";
  } catch (error: any) {
    console.error("Falha no Whisper:", error);
    return `Erro ao transcrever áudio: ${error.message}`;
  }
}

/**
 * Síntese de Voz (TTS) com OpenAI TTS-1
 */
export async function synthesizeVoiceOpenAi(
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "nova"
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY não configurada para síntese de voz.");
    return null;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice,
      }),
    });

    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch (error) {
    console.error("Erro no OpenAI TTS:", error);
    return null;
  }
}
