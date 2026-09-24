import { z } from "zod";

// 1. Validação de Submissão de Lead pelo Quiz / Anúncio
export const QuizSubmitSchema = z.object({
  slug: z.string().min(2).max(100),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  telefone: z
    .string()
    .min(8, "Telefone inválido")
    .max(25)
    .regex(/^[0-9+()\s-]+$/, "Telefone contém caracteres inválidos"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  answers: z.record(z.any()).optional(),
  utmSource: z.string().max(100).optional(),
  utmCampaign: z.string().max(150).optional(),
  utmMedium: z.string().max(100).optional(),
});

// 2. Validação de Documento para RAG
export const KnowledgeDocSchema = z.object({
  titulo: z.string().min(2, "Título é obrigatório").max(200),
  conteudoTexto: z.string().min(10, "Conteúdo do documento deve ter no mínimo 10 caracteres").max(500000),
  tipo: z.enum(["MANUAL", "FAQ", "TABELA_PRECOS", "PDF", "TEXT"]).default("MANUAL"),
});

// 3. Validação de Login / Credenciais
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// 4. Sanitizador de Prompt Injection para RAG
export function sanitizeUserPrompt(input: string): string {
  if (!input) return "";
  // Remove comandos de quebra de instrução conhecidos
  return input
    .replace(/ignore all previous instructions/gi, "[blocked_instruction]")
    .replace(/ignore as instruções anteriores/gi, "[blocked_instruction]")
    .replace(/system prompt/gi, "[blocked_term]")
    .replace(/reveal your instructions/gi, "[blocked_instruction]")
    .slice(0, 4000)
    .trim();
}
