import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { empresaNome, nome, email, telefone, senha } = body;

    if (!empresaNome || !nome || !email || !senha) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verifica se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado no sistema." },
        { status: 400 }
      );
    }

    // Gera o slug da organização a partir do nome da empresa
    const baseSlug = empresaNome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Cria a Organização do novo cliente
    const org = await prisma.organization.create({
      data: {
        nome: empresaNome.trim(),
        slug: uniqueSlug,
        segmento: "GENERAL",
        plano: "starter",
        statusPlano: "ativo",
        whatsappNumber: telefone ? telefone.trim() : null,
      },
    });

    // Cria o Usuário Administrador da Empresa
    const passwordHash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        organizationId: org.id,
        nome: nome.trim(),
        email: cleanEmail,
        senhaHash: passwordHash,
        role: "ADMIN_EMPRESA",
      },
    });

    // Cria a Sessão Criptografada do novo cliente
    const session = await getSession();
    session.userId = user.id;
    session.organizationId = org.id;
    session.organizationNome = org.nome;
    session.organizationSlug = org.slug;
    session.organizationSegmento = org.segmento;
    session.nome = user.nome;
    session.email = user.email;
    session.role = user.role;
    session.isDemoMode = false;
    await session.save();

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, nome: user.nome },
      organization: { id: org.id, slug: org.slug, nome: org.nome },
    });
  } catch (error: any) {
    console.error("Erro no registro comercial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
