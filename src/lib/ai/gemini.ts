/**
 * Google Gemini API Client (Flash 1.5 / 2.0)
 * Suporta geração de texto, análise de imagens (Vision) e classificação de leads.
 */

export interface GeminiGenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export async function generateWithGemini(
  prompt: string,
  options?: GeminiGenerateOptions
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback inteligente caso a chave ainda não tenha sido inserida no .env
    return "[Gemini AI]: Chave de API GEMINI_API_KEY não configurada no .env. Configure para ativar o processamento em tempo real.";
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: options?.systemInstruction
        ? { parts: [{ text: options.systemInstruction }] }
        : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.4,
        maxOutputTokens: options?.maxOutputTokens ?? 1024,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erro na API do Gemini:", err);
      return `Erro Gemini (${res.status}): Não foi possível processar a requisição.`;
    }

    const data = await res.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sem resposta do modelo."
    );
  } catch (error: any) {
    console.error("Falha ao chamar Gemini:", error);
    return `Erro de conexão com Gemini: ${error.message}`;
  }
}

/**
 * Análise de Imagem (Visão Computacional) com Gemini Flash
 */
export async function analyzeImageWithGemini(
  imageBase64: string,
  mimeType: string,
  instruction: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "GEMINI_API_KEY não configurada para análise de imagem.";
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: instruction },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível analisar a imagem."
    );
  } catch (error: any) {
    console.error("Falha no Gemini Vision:", error);
    return `Erro de análise visual: ${error.message}`;
  }
}
