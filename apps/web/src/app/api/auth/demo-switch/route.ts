import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session.userId || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acesso restrito ao Super Administrador" },
        { status: 403 }
      );
    }

    const { targetSlug } = await req.json();

    const targetOrg = await prisma.organization.findUnique({
      where: { slug: targetSlug },
    });

    if (!targetOrg) {
      return NextResponse.json(
        { error: "Organização alvo não encontrada" },
        { status: 404 }
      );
    }

    // Atualiza a sessão mantendo o papel de SUPER_ADMIN mas com a organização alterada
    session.organizationId = targetOrg.id;
    session.organizationNome = targetOrg.nome;
    session.organizationSlug = targetOrg.slug;
    session.organizationSegmento = targetOrg.segmento;
    session.isDemoMode = true;

    await session.save();

    return NextResponse.json({
      success: true,
      currentOrg: {
        id: targetOrg.id,
        nome: targetOrg.nome,
        slug: targetOrg.slug,
        segmento: targetOrg.segmento,
      },
    });
  } catch (error: any) {
    console.error("Erro no demo-switch:", error);
    return NextResponse.json(
      { error: "Erro ao alternar modo de demonstração" },
      { status: 500 }
    );
  }
}
