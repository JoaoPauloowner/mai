import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/compliance";
import { handleApiError } from "@/lib/errors";
import { OrganizationUpdateSchema } from "@/lib/validation";

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
    return handleApiError(error, "Falha ao consultar dados da organização.");
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = OrganizationUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos para organização", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      nome,
      telefoneComercial,
      whatsappNumber,
      cnpj,
      emailNotificacoes,
      instagramHandle,
    } = parseResult.data;

    const updated = await prisma.organization.update({
      where: { id: session.organizationId },
      data: {
        ...(nome ? { nome: nome.trim() } : {}),
        ...(telefoneComercial !== undefined ? { telefoneComercial: telefoneComercial ? normalizePhone(telefoneComercial) : null } : {}),
        ...(whatsappNumber !== undefined ? { whatsappNumber: whatsappNumber ? normalizePhone(whatsappNumber) : null } : {}),
        ...(cnpj !== undefined ? { cnpj } : {}),
        ...(emailNotificacoes !== undefined ? { emailNotificacoes: emailNotificacoes || null } : {}),
        ...(instagramHandle !== undefined ? { instagramHandle } : {}),
      },
    });

    // Atualiza nome na sessão se mudou
    if (nome) {
      session.organizationNome = nome;
      await session.save();
    }

    return NextResponse.json({ success: true, organization: updated });
  } catch (error: any) {
    return handleApiError(error, "Falha ao atualizar dados da organização.");
  }
}
