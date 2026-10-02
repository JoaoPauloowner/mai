import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";

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
      return NextResponse.json(
        { error: "Lead não encontrado ou não pertence a esta organização." },
        { status: 404 }
      );
    }

    // Exclusão definitiva de todos os dados do lead
    const convs = await prisma.conversation.findMany({ where: { leadId: id } });
    for (const conv of convs) {
      await prisma.message.deleteMany({ where: { conversationId: conv.id } });
    }
    await prisma.conversation.deleteMany({ where: { leadId: id } });
    await prisma.appointment.deleteMany({ where: { leadId: id } });
    await prisma.lead.delete({ where: { id } });

    // Grava AuditLog com ação específica LEAD_PURGED_LGPD
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "LEAD_PURGED_LGPD",
        detalhes: `Direito ao esquecimento (LGPD Art. 18): Lead "${lead.nome}" (ID: ${lead.id}) e todo o histórico associado foram purgados permanentemente por ${session.nome}.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Todos os dados pessoais e histórico do lead foram purgados permanentemente em conformidade com a LGPD.",
    });
  } catch (error: any) {
    return handleApiError(error, "Falha ao purgar dados do lead.");
  }
}
