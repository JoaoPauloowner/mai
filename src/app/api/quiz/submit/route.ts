import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";
import { assignLeadToNextSeller } from "@/lib/round-robin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug,
      nome,
      telefone,
      email,
      answers,
      utmSource,
      utmCampaign,
      utmMedium,
    } = body;

    if (!nome || !telefone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o tenant pelo slug ou pega o padrão
    let org = await prisma.organization.findUnique({
      where: { slug: slug || "omni-demo" },
    });

    if (!org) {
      org = await prisma.organization.findFirst();
    }

    if (!org) {
      return NextResponse.json(
        { error: "Organização não encontrada" },
        { status: 404 }
      );
    }

    const normalizedPhone = normalizePhone(telefone);
    const sha256 = hashPhone(normalizedPhone);

    // Algoritmo de Lead Scoring em Tempo Real
    let score = 70;
    let justificativa = "Lead preencheu o mini-quiz interativo.";

    const answersStr = JSON.stringify(answers || {});
    if (answersStr.includes("urgente") || answersStr.includes("imediato") || answersStr.includes("semana")) {
      score += 15;
      justificativa += " Alta urgência de contratação declarada.";
    }

    if (answersStr.includes("alto") || answersStr.includes("200k") || answersStr.includes("avista")) {
      score += 10;
      justificativa += " Capacidade financeira elevada.";
    }

    score = Math.min(score, 98);

    // Criação ou atualização do Lead
    const lead = await prisma.lead.create({
      data: {
        organizationId: org.id,
        nome,
        telefone: normalizedPhone,
        telefoneHash: sha256,
        email: email || null,
        status: "QUALIFICADO",
        prioridade: score >= 80 ? "HOT" : "WARM",
        score,
        scoreJustificativa: justificativa,
        origemCanal: "QUIZ",
        utmSource: utmSource || "meta_ads",
        utmCampaign: utmCampaign || "campanha_quiz_trafego",
        utmMedium: utmMedium || "stories_cpc",
        quizAnswersJson: JSON.stringify(answers || {}),
        ramoInteresse: "Captação via Mini-Quiz",
        valorNegocio: 15000,
      },
    });

    // Distribuição automática para a equipe de vendedores (Round-Robin)
    await assignLeadToNextSeller(org.id, lead.id);

    // Inicia a conversa no CRM automaticamente
    const conv = await prisma.conversation.create({
      data: {
        organizationId: org.id,
        leadId: lead.id,
        canal: "WHATSAPP",
        status: "ABERTO",
      },
    });

    await prisma.message.create({
      data: {
        conversationId: conv.id,
        remetenteTipo: "SISTEMA",
        tipoConteudo: "TEXTO",
        conteudo: `[Mini-Quiz Preenchido]: ${nome} concluiu o formulário de captação. Respostas: ${JSON.stringify(answers)}`,
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      whatsappNumber: org.whatsappNumber || "+5511999990001",
    });
  } catch (error: any) {
    console.error("Erro no submit do quiz:", error);
    return NextResponse.json(
      { error: "Falha ao registrar respostas do quiz" },
      { status: 500 }
    );
  }
}
