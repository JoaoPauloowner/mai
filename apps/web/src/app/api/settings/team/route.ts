import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import { TeamInviteSchema, TeamRoleUpdateSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ALLOWED_ROLES = ["ADMIN_EMPRESA", "VENDEDOR"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

// Listar membros da equipe da organização
export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { organizationId: session.organizationId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { assignedLeads: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao listar equipe." }, { status: 500 });
  }
}

// Convidar / Cadastrar novo vendedor ou gerente
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.role !== "ADMIN_EMPRESA" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Apenas administradores podem gerenciar a equipe." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parseResult = TeamInviteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos para convite de membro", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nome, email, role, senha } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();

    // S1: Allowlist estrita de roles (SUPER_ADMIN NUNCA atribuível via API de tenant)
    const targetRole: AllowedRole = role && ALLOWED_ROLES.includes(role as AllowedRole) ? (role as AllowedRole) : "VENDEDOR";

    // S1: Verifica se o e-mail já existe com normalização
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe um usuário cadastrado com este e-mail." },
        { status: 400 }
      );
    }

    // S1: Validação de senha segura ou geração de senha temporária criptograficamente aleatória
    let passwordToHash = senha;
    if (!passwordToHash) {
      passwordToHash = crypto.randomBytes(8).toString("hex") + "A1!";
    }

    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    const newUser = await prisma.user.create({
      data: {
        organizationId: session.organizationId,
        nome: nome.trim(),
        email: cleanEmail,
        senhaHash: passwordHash,
        role: targetRole,
      },
    });

    // Grava no AuditLog (Item 5)
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "USER_INVITED",
        detalhes: `Usuário ${newUser.nome} (${newUser.email}) cadastrado com a função ${newUser.role} por ${session.nome}.`,
      },
    });

    const inviteLink = `https://omnisdr-app.vercel.app/login?email=${encodeURIComponent(newUser.email)}`;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
      inviteLink,
    });
  } catch (error: any) {
    return handleApiError(error, "Erro ao convidar membro da equipe.");
  }
}

// Atualizar função / permissão de um membro da equipe (Item 5)
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.role !== "ADMIN_EMPRESA" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Apenas administradores podem alterar permissões." }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = TeamRoleUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos para alteração de função", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { targetUserId, newRole } = parseResult.data;

    // S1: Impede alterar a própria função (auto-promoção ou auto-rebaixamento)
    if (targetUserId === session.userId) {
      return NextResponse.json(
        { error: "Você não pode alterar sua própria função de permissão." },
        { status: 400 }
      );
    }

    // S1: Validação de role permitida
    if (!ALLOWED_ROLES.includes(newRole)) {
      return NextResponse.json(
        { error: "Função não permitida para o tenant." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findFirst({
      where: { id: targetUserId, organizationId: session.organizationId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado na organização." }, { status: 404 });
    }

    // S1: Impede rebaixar o último ADMIN_EMPRESA da organização
    if (targetUser.role === "ADMIN_EMPRESA" && newRole !== "ADMIN_EMPRESA") {
      const adminCount = await prisma.user.count({
        where: { organizationId: session.organizationId, role: "ADMIN_EMPRESA" },
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Não é possível rebaixar o único administrador da organização." },
          { status: 400 }
        );
      }
    }

    const oldRole = targetUser.role;
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, nome: true, email: true, role: true },
    });

    // Grava no AuditLog (Item 5)
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "USER_ROLE_CHANGED",
        detalhes: `Permissão de ${targetUser.nome} alterada de "${oldRole}" para "${newRole}" pelo administrador ${session.nome}.`,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return handleApiError(error, "Erro ao atualizar permissão.");
  }
}

// Remover membro da equipe (Item 5)
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.role !== "ADMIN_EMPRESA" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Apenas administradores podem remover membros." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("id");

    if (!targetUserId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    if (targetUserId === session.userId) {
      return NextResponse.json({ error: "Você não pode remover seu próprio usuário administrador." }, { status: 400 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { id: targetUserId, organizationId: session.organizationId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado na organização." }, { status: 404 });
    }

    // S1: Impede remover o último ADMIN_EMPRESA
    if (targetUser.role === "ADMIN_EMPRESA") {
      const adminCount = await prisma.user.count({
        where: { organizationId: session.organizationId, role: "ADMIN_EMPRESA" },
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Não é possível remover o único administrador da organização." },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({ where: { id: targetUserId } });

    // Grava no AuditLog (Item 5)
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "USER_REMOVED",
        detalhes: `Membro da equipe ${targetUser.nome} (${targetUser.email}) removido pelo administrador ${session.nome}.`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleApiError(error, "Erro ao remover usuário da organização.");
  }
}

