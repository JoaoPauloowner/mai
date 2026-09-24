import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
    
    // 1. Rate Limiting (3 cadastros por IP a cada 1 hora)
    const limit = checkRateLimit(`register_${ip}`, 3, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Limite de cadastros excedido para este IP. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { empresaNome, nome, email, telefone, senha } = body;

    if (!empresaNome || !nome || !email || !senha) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Verifica se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado no sistema." },
        { status: 400 }
      );
    }

    // 3. Gera o slug da organização a partir do nome da empresa
    const baseSlug = empresaNome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // 4. Cria a Organização do novo cliente
    const org = await prisma.organization.create({
      data: {
        nome: empresaNome.trim(),
        slug: uniqueSlug,
        segmento: "GENERAL",
        plano: "starter",
        statusPlano: "trial",
        whatsappNumber: telefone ? telefone.trim() : null,
      },
    });

    // 5. Cria o Usuário Administrador da Empresa
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

    // 6. Grava no AuditLog (Item 8)
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          acao: "ORGANIZATION_REGISTER",
          detalhes: `Organização "${org.nome}" cadastrada por ${user.nome} (${user.email}).`,
          ipAddress: ip,
        },
      });
    } catch (auditError) {
      console.error("[AuditLog Register Error]", auditError);
    }

    // 7. Cria a Sessão Criptografada do novo cliente
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
