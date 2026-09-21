import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { titulo, dataHorario, descricao, tipo } = body;

    if (!titulo || !dataHorario) {
      return NextResponse.json(
        { error: "Título e Data/Horário são obrigatórios" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true, organizationId: true },
    });

    if (!lead || lead.organizationId !== session.organizationId) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        organizationId: session.organizationId,
        leadId: id,
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : null,
        dataHorario: new Date(dataHorario),
        tipo: tipo || "VISITA",
        status: "AGENDADO",
      },
    });

    // Atualiza o status do lead para AGENDADO se for novo ou qualificado
    await prisma.lead.update({
      where: { id },
      data: { status: "AGENDADO" },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
