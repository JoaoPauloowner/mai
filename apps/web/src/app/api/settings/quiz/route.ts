import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const DEFAULT_QUIZ_CONFIG = {
  titulo: "Diagnostico Especializado",
  subtitulo: "Responda em 1 minuto para receber uma proposta e simulacao personalizada.",
  step1: {
    titulo: "Qual a sua principal necessidade no momento?",
    opcoes: [
      "Aquisicao / Compra com as melhores condicoes",
      "Reducao de custos e otimizacao fiscal/seguros",
      "Consultoria ou agendamento para esta semana",
      "Comparativo completo de propostas de mercado",
    ],
  },
  step2: {
    titulo: "Qual e a urgencia para a sua decisao?",
    opcoes: [
      "Urgente: Quero resolver ainda nesta semana",
      "Proximos 15 a 30 dias",
      "Apenas pesquisando e comparando valores",
    ],
  },
  botaoCta: "Receber Atendimento Prioritario",
  mensagemSucesso: "Nossa equipe e assistente de IA ja estao preparando seu atendimento.",
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      select: {
        quizConfigJson: true,
        slug: true,
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
      slug: org?.slug || "omni-demo",
      quizUrl: `http://localhost:3000/quiz/${org?.slug || "omni-demo"}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { config } = await req.json();

    const updated = await prisma.organization.update({
      where: { id: session.organizationId },
      data: {
        quizConfigJson: JSON.stringify(config || DEFAULT_QUIZ_CONFIG),
      },
    });

    return NextResponse.json({ success: true, organization: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
