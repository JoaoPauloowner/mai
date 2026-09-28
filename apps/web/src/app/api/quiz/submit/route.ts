import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";
import { assignLeadToNextSeller } from "@/lib/round-robin";
import { checkRateLimit, getTrustedClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 1. Rate limiting por IP do cliente
    const clientIp = getTrustedClientIp(req);
    const rateLimit = checkRateLimit(`quiz_submit:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Limite de submissões excedido. Aguarde alguns minutos." },
        { status: 429 }
      );
    }

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

    const trimmedSlug = (slug || "").trim();
    if (!trimmedSlug) {
      return NextResponse.json(
        { error: "Identificador da empresa (slug) é obrigatório." },
        { status: 400 }
      );
    }

    const trimmedName = (nome || "").trim().slice(0, 120);
    const trimmedPhone = (telefone || "").trim();

    if (!trimmedName || !trimmedPhone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(trimmedPhone);
    const digitsOnly = normalizedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: "Número de telefone inválido. Informe DDD + número." },
        { status: 400 }
      );
    }

    // 2. Busca estrita do tenant pelo slug - sem fallback para primeira organização
    const org = await prisma.organization.findUnique({
      where: { slug: trimmedSlug },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organização não encontrada" },
        { status: 404 }
      );
    }

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
        nome: trimmedName,
        telefone: normalizedPhone,
        telefoneHash: sha256,
        email: email ? String(email).trim().toLowerCase().slice(0, 120) : null,
        status: "QUALIFICADO",
        prioridade: score >= 80 ? "HOT" : "WARM",
        score,
        scoreJustificativa: justificativa,
        origemCanal: "QUIZ",
        utmSource: utmSource ? String(utmSource).slice(0, 80) : "meta_ads",
        utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 80) : "campanha_quiz_trafego",
        utmMedium: utmMedium ? String(utmMedium).slice(0, 80) : "stories_cpc",
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
        conteudo: `[Mini-Quiz Preenchido]: ${trimmedName} concluiu o formulário de captação.`,
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      whatsappNumber: org.whatsappNumber || null,
    });
  } catch (error: any) {
    console.error("Erro no submit do quiz:", error);
    return NextResponse.json(
      { error: "Falha ao registrar respostas do quiz" },
      { status: 500 }
    );
  }
}
