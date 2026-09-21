import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/compliance";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      select: {
        id: true,
        nome: true,
        slug: true,
        segmento: true,
        telefoneComercial: true,
        whatsappNumber: true,
        cnpj: true,
        emailNotificacoes: true,
        instagramHandle: true,
      },
    });

    return NextResponse.json({ organization: org });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      nome,
      telefoneComercial,
      whatsappNumber,
      cnpj,
      emailNotificacoes,
      instagramHandle,
    } = body;

    const updated = await prisma.organization.update({
      where: { id: session.organizationId },
      data: {
        ...(nome ? { nome } : {}),
        ...(telefoneComercial ? { telefoneComercial: normalizePhone(telefoneComercial) } : {}),
        ...(whatsappNumber ? { whatsappNumber: normalizePhone(whatsappNumber) } : {}),
        ...(cnpj ? { cnpj } : {}),
        ...(emailNotificacoes ? { emailNotificacoes } : {}),
        ...(instagramHandle ? { instagramHandle } : {}),
      },
    });

    // Atualiza nome na sessão se mudou
    if (nome) {
      session.organizationNome = nome;
      await session.save();
    }

    return NextResponse.json({ success: true, organization: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
