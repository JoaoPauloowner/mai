import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import { LeadNoteSchema } from "@/lib/validation";

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
    const parseResult = LeadNoteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Texto da anotação inválido", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { texto } = parseResult.data;

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true, organizationId: true, notasInternasJson: true },
    });

    if (!lead || lead.organizationId !== session.organizationId) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    let notas: Array<{ id: string; autor: string; texto: string; createdAt: string }> = [];
    if (lead.notasInternasJson) {
      try {
        notas = JSON.parse(lead.notasInternasJson);
      } catch {
        notas = [];
      }
    }

    const novaNota = {
      id: "nota_" + Date.now(),
      autor: session.nome || "Atendente",
      texto: texto.trim(),
      createdAt: new Date().toISOString(),
    };

    notas.unshift(novaNota);

    await prisma.lead.update({
      where: { id },
      data: {
        notasInternasJson: JSON.stringify(notas),
      },
    });

    return NextResponse.json({ success: true, nota: novaNota, notas });
  } catch (error: any) {
    return handleApiError(error, "Falha ao salvar anotação interna do lead.");
  }
}
