import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
        appointments: true,
      },
    });

    if (!lead || lead.organizationId !== session.organizationId) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const {
      status,
      score,
      prioridade,
      valorNegocio,
      nome,
      email,
      telefone,
      empresa,
      ramoInteresse,
      resumoIa,
    } = body;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(score !== undefined ? { score: Number(score) } : {}),
        ...(prioridade ? { prioridade } : {}),
        ...(valorNegocio !== undefined ? { valorNegocio: Number(valorNegocio) } : {}),
        ...(nome ? { nome: nome.trim() } : {}),
        ...(email !== undefined ? { email: email ? email.trim() : null } : {}),
        ...(telefone ? { telefone: telefone.trim() } : {}),
        ...(empresa !== undefined ? { empresa: empresa ? empresa.trim() : null } : {}),
        ...(ramoInteresse !== undefined ? { ramoInteresse: ramoInteresse ? ramoInteresse.trim() : null } : {}),
        ...(resumoIa !== undefined ? { resumoIa } : {}),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Excluir Lead e dados associados em conformidade com a LGPD (Item 5)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    const lead = await prisma.lead.findFirst({
      where: { id, organizationId: session.organizationId },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado ou não pertence a esta organização." }, { status: 404 });
    }

    // Exclusão de mensagens e conversas vinculadas
    const convs = await prisma.conversation.findMany({ where: { leadId: id } });
    for (const conv of convs) {
      await prisma.message.deleteMany({ where: { conversationId: conv.id } });
    }
    await prisma.conversation.deleteMany({ where: { leadId: id } });
    await prisma.appointment.deleteMany({ where: { leadId: id } });
    await prisma.lead.delete({ where: { id } });

    // Grava no AuditLog com conformidade LGPD (Item 5)
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "LEAD_DELETED_LGPD",
        detalhes: `Lead "${lead.nome}" (${lead.telefone || lead.email || "Sem contato"}) e histórico de mensagens excluídos em definitivo por ${session.nome} (Solicitação LGPD / Gestão da Base).`,
      },
    });

    return NextResponse.json({ success: true, message: "Lead e dados associados excluídos com sucesso." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

