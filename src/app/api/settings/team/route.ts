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

    // Mensagem de convite via WhatsApp se o telefone foi informado
    const inviteLink = `http://localhost:3000/login?email=${encodeURIComponent(newUser.email)}`;
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
