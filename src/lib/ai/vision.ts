import { analyzeImageWithGemini } from "./gemini";

export interface VisionAnalysisResult {
  tipo: "VEICULO" | "DOCUMENTO" | "COMPROVANTE" | "DESCONHECIDO";
  descricao: string;
  detalhesIdentificados: Record<string, any>;
  avariasIdentificadas?: string[];
  qualidadeImagem: "ALTA" | "MEDIA" | "BAIXA";
}

/**
 * Motor de Visão Computacional Unificado
 * Analisa fotos de seminovos, avarias, CNH, comprovantes e fotos de procedimentos.
 */
export async function analyzeImage(
  imageBase64: string,
  mimeType = "image/jpeg",
  contexto: "AUTOMOTIVO" | "DOCUMENTO" | "GERAL" = "GERAL"
): Promise<string> {
  let instruction = "Descreva detalhadamente o que você vê nesta imagem e extraia todas as informações textuais ou visuais relevantes.";

  if (contexto === "AUTOMOTIVO") {
    instruction = `Você é um perito avaliador de veículos. Analise a foto do automóvel com precisão técnica:
1. Identifique Marca, Modelo e Cor aproximada.
2. Verifique se há arranhões, amassados, riscos na pintura, danos nos faróis ou nas rodas.
3. Se for foto do painel/odômetro, extraia a quilometragem e luzes de alerta.
4. Responda em português de forma concisa e profissional.`;
  } else if (contexto === "DOCUMENTO") {
    instruction = `Você é um analista de compliance e onboarding. Analise este documento:
1. Identifique o tipo de documento (CNH, RG, Comprovante de Residência, Apólice, Certidão).
2. Extraia os dados legíveis (Nome, CPF/CNPJ, Data de Emissão/Validade).
3. Indique se a foto está nítida ou se precisa ser reenviada.`;
  }

  // Utiliza Gemini Flash (rápido, econômico e altamente capaz em visão)
  return await analyzeImageWithGemini(imageBase64, mimeType, instruction);
}
