import { prisma } from "@/lib/prisma";

// Função para calcular similaridade de cosseno entre dois vetores numéricos
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fatiador de texto inteligente (Chunking em blocos com sobreposição)
export function chunkText(text: string, chunkSize: number = 400, overlap: number = 50): string[] {
  if (!text) return [];
  const clean = text.replace(/\r\n/g, "\n").trim();
  const words = clean.split(/\s+/);
  const chunks: string[] = [];

  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentLength += word.length + 1;

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(" "));
      const overlapWords = Math.floor((overlap / chunkSize) * currentChunk.length);
      currentChunk = currentChunk.slice(currentChunk.length - overlapWords);
      currentLength = currentChunk.join(" ").length;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

// Geração de Embeddings (OpenAI ou fallback simulado determinístico para dev/test)
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text.slice(0, 8000),
          model: "text-embedding-3-small",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.data[0].embedding;
      }
    } catch (e) {
      console.warn("Falha na API OpenAI de embedding, usando fallback local:", e);
    }
  }

  // Fallback determinístico (1536 dimensões) para ambientes locais sem chave de API
  const vector = new Array(1536).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = (charCode * 31 + i * 17) % 1536;
    vector[index] = (vector[index] + (charCode / 255)) % 1;
  }
  return vector;
}

// Busca Semântica RAG multi-tenant no banco de dados (Híbrido: Native PostgreSQL pgvector + In-Memory Fallback)
export async function searchKnowledgeBase({
  organizationId,
  query,
  limit = 4,
  threshold = 0.1,
}: {
  organizationId: string;
  query: string;
  limit?: number;
  threshold?: number;
}): Promise<Array<{ id: string; documento: string; conteudo: string; score: number }>> {
  const queryEmbedding = await generateEmbedding(query);

  // 1. Tentar busca nativa no PostgreSQL (pgvector via Stored Procedure)
  try {
    const vectorString = `[${queryEmbedding.join(",")}]`;
    const pgResults = await prisma.$queryRaw<
      Array<{ id: string; documento_titulo: string; conteudo_texto: string; similarity: number }>
    >`SELECT * FROM match_knowledge_chunks(${vectorString}::vector, ${threshold}, ${limit}, ${organizationId})`;

    if (pgResults && pgResults.length > 0) {
      return pgResults.map((r) => ({
        id: r.id,
        documento: r.documento_titulo,
        conteudo: r.conteudo_texto,
        score: Number(r.similarity),
      }));
    }
  } catch {
    // Caso esteja rodando em SQLite local ou o banco ainda não tenha a stored procedure
  }

  // 2. Fallback: Busca e cálculo de similaridade de cosseno em memória (compatível com SQLite)
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { organizationId },
    include: { document: true },
  });

  if (chunks.length === 0) return [];

  const scored = chunks
    .map((chunk) => {
      let embedding: number[] = [];
      try {
        embedding = chunk.embeddingJson ? JSON.parse(chunk.embeddingJson) : [];
      } catch {
        embedding = [];
      }

      const score = cosineSimilarity(queryEmbedding, embedding);
      return {
        id: chunk.id,
        documento: chunk.document.titulo,
        conteudo: chunk.conteudoTexto,
        score,
      };
    })
    .filter((item) => item.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
