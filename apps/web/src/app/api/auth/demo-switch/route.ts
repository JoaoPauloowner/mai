import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getTrustedClientIp } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

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

    // Grava AuditLog da troca de contexto por Super Admin (M9)
    const ip = getTrustedClientIp(req);
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: targetOrg.id,
          userId: session.userId,
          acao: "DEMO_SWITCH",
          detalhes: `Super Admin ${session.nome} (${session.email}) alternou contexto para a organização "${targetOrg.nome}" (${targetOrg.slug}).`,
          ipAddress: ip,
        },
      });
    } catch (auditError) {
      console.error("[AuditLog Demo Switch Error]", auditError);
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
    return handleApiError(error, "Erro ao alternar modo de demonstração.");
  }
}
