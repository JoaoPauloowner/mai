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
  email: z.string().email("E-mail inválido").optional().nullable().or(z.literal("")),
  answers: z.record(z.string(), z.any()).optional(),
  utmSource: z.string().max(100).optional(),
  utmCampaign: z.string().max(150).optional(),
  utmMedium: z.string().max(100).optional(),
});

// 2. Validação de Documento para RAG (Knowledge Base)
export const KnowledgeDocSchema = z.object({
  titulo: z.string().min(2, "Título deve ter no mínimo 2 caracteres").max(200, "Título não pode exceder 200 caracteres"),
  conteudoTexto: z.string().min(10, "Conteúdo do documento deve ter no mínimo 10 caracteres").max(200000, "Conteúdo do documento não pode exceder 200.000 caracteres (~50 páginas)"),
  tipo: z.enum(["MANUAL", "FAQ", "TABELA_PRECOS", "PDF", "TEXT"]).default("MANUAL"),
});

// 3. Validação de Login / Credenciais
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// 4. Validação de Atualização de Lead
export const LeadUpdateSchema = z.object({
  status: z.enum(["NOVO", "QUALIFICADO", "AGENDADO", "NEGOCIACAO", "GANHO", "PERDIDO"]).optional(),
  score: z.number().min(0).max(100).optional(),
  prioridade: z.enum(["LOW", "MEDIUM", "WARM", "HOT"]).optional(),
  valorNegocio: z.number().min(0).optional(),
  nome: z.string().min(1).max(120).optional(),
  email: z.string().email("E-mail inválido").optional().nullable().or(z.literal("")),
  telefone: z.string().max(30).optional(),
  empresa: z.string().max(150).optional().nullable(),
  ramoInteresse: z.string().max(150).optional().nullable(),
  resumoIa: z.string().max(3000).optional().nullable(),
});

// 5. Validação de Agendamento vinculado ao Lead
export const LeadAppointmentSchema = z.object({
  titulo: z.string().min(2, "Título é obrigatório").max(150),
  dataHorario: z.string().min(8, "Data e horário válidos são obrigatórios"),
  descricao: z.string().max(1000).optional().nullable(),
  tipo: z.enum(["VISITA", "CALL", "TEST_DRIVE", "REUNIAO"]).optional().default("VISITA"),
});

// 6. Validação de Anotação Interna do Lead
export const LeadNoteSchema = z.object({
  texto: z.string().min(1, "Texto da anotação é obrigatório").max(2000, "Anotação não pode exceder 2.000 caracteres"),
});

// 7. Validação de Gestão de Membros de Equipe
export const TeamInviteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(120),
  email: z.string().email("E-mail inválido").max(120),
  telefone: z.string().max(30).optional().nullable(),
  role: z.enum(["ADMIN_EMPRESA", "VENDEDOR"]).default("VENDEDOR"),
  senha: z.string().min(8, "A senha deve conter no mínimo 8 caracteres").max(100).optional(),
});

export const TeamRoleUpdateSchema = z.object({
  targetUserId: z.string().min(5, "ID do usuário é obrigatório"),
  newRole: z.enum(["ADMIN_EMPRESA", "VENDEDOR"]),
});

// 8. Validação de Análise Visual de Imagens (Vision AI)
export const VisionAnalyzeSchema = z.object({
  imageBase64: z
    .string()
    .min(20, "Imagem em base64 é obrigatória")
    .max(14 * 1024 * 1024, "Tamanho máximo da imagem base64 é 10MB"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]).optional().default("image/jpeg"),
  contexto: z.enum(["AUTOMOTIVO", "DOCUMENTO", "GERAL"]).optional().default("AUTOMOTIVO"),
});

// 9. Validação de Organização
export const OrganizationUpdateSchema = z.object({
  nome: z.string().min(2).max(120).optional(),
  telefoneComercial: z.string().max(30).optional().nullable(),
  whatsappNumber: z.string().max(30).optional().nullable(),
  cnpj: z.string().max(25).optional().nullable(),
  emailNotificacoes: z.string().email("E-mail de notificações inválido").optional().nullable().or(z.literal("")),
  instagramHandle: z.string().max(60).optional().nullable(),
});

// 10. Sanitizador de Prompt Injection para RAG
export function sanitizeUserPrompt(input: string): string {
  if (!input) return "";
  return input
    .replace(/ignore all previous instructions/gi, "[blocked_instruction]")
    .replace(/ignore as instruções anteriores/gi, "[blocked_instruction]")
    .replace(/system prompt/gi, "[blocked_term]")
    .replace(/reveal your instructions/gi, "[blocked_instruction]")
    .slice(0, 4000)
    .trim();
}
