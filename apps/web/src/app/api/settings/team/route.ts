import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { nome, email, telefone, role, senha } = body;

    if (!nome || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica se o e-mail já existe
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe um usuário cadastrado com este e-mail." },
        { status: 400 }
      );
    }

    // Senha padrão temporária ou definida
    const passwordToHash = senha || "Mudar@123";
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    const newUser = await prisma.user.create({
      data: {
        organizationId: session.organizationId,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senhaHash: passwordHash,
        role: role || "VENDEDOR",
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

    // Mensagem de convite via WhatsApp se o telefone foi informado
    const inviteLink = `https://omnisdr-app.vercel.app/login?email=${encodeURIComponent(newUser.email)}`;
    const inviteMessage = `Olá ${nome}! Você foi adicionado à equipe no Omni Service SaaS como ${role === "ADMIN_EMPRESA" ? "Gerente" : "Vendedor"}. Acesse o painel pelo link: ${inviteLink} (Senha inicial: ${passwordToHash})`;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
      inviteMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { targetUserId, newRole } = body;

    if (!targetUserId || !newRole) {
      return NextResponse.json({ error: "ID do usuário e nova função são obrigatórios." }, { status: 400 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { id: targetUserId, organizationId: session.organizationId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado na organização." }, { status: 404 });
    }

    const oldRole = targetUser.role;
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

