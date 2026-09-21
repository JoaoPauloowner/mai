import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_QUIZ_CONFIG = {
  titulo: "Diagnóstico Especializado",
  subtitulo: "Responda em 1 minuto para receber uma proposta e simulação personalizada.",
  step1: {
    titulo: "Qual a sua principal necessidade no momento?",
    opcoes: [
      "Aquisição / Compra com as melhores condições",
      "Redução de custos e otimização fiscal/seguros",
      "Consultoria ou agendamento para esta semana",
      "Comparativo completo de propostas de mercado",
    ],
  },
  step2: {
    titulo: "Qual é a urgência para a sua decisão?",
    opcoes: [
      "Urgente: Quero resolver ainda nesta semana",
      "Próximos 15 a 30 dias",
      "Apenas pesquisando e comparando valores",
    ],
  },
  botaoCta: "Receber Atendimento Prioritário",
  mensagemSucesso: "Nossa equipe e assistente de IA já estão preparando seu atendimento.",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "omni-demo";

    const org = await prisma.organization.findUnique({
      where: { slug },
      select: {
        nome: true,
        quizConfigJson: true,
        whatsappNumber: true,
      },
    });

    let config = DEFAULT_QUIZ_CONFIG;
    if (org?.quizConfigJson) {
      try {
        config = JSON.parse(org.quizConfigJson);
      } catch {
        // default
      }
    }

    return NextResponse.json({
      config,
      orgNome: org?.nome || "Omni Growth Hub",
      whatsappNumber: org?.whatsappNumber || "+5511999990001",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
