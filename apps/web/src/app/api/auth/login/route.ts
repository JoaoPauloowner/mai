import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getTrustedClientIp } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const ip = getTrustedClientIp(req);
    const body = await req.json();
    const { email, password } = body;

    // 1. Rate Limiting (5 tentativas por IP/Email em 15 minutos)
    const rateLimitKey = `login_${ip}_${email || "anon"}`;
    const limit = await checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de login. Aguarde 15 minutos antes de tentar novamente." },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await validateCredentials(email, password);

    if (!user) {
      try {
        await prisma.auditLog.create({
          data: {
            organizationId: "auth_gateway",
            acao: "LOGIN_FAILED",
            detalhes: `Tentativa de login falha para o e-mail: ${email.slice(0, 3)}***@${email.split("@")[1] || "domain"}`,
            ipAddress: ip,
          },
        });
      } catch {}

      return NextResponse.json(
        { error: "Credenciais inválidas. Verifique seu e-mail e senha." },
        { status: 401 }
      );
    }

    // 2. Gravar AuditLog de Login
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: user.organizationId,
          userId: user.userId,
          acao: "LOGIN",
          detalhes: `Usuário ${user.nome} (${user.email}) realizou login com sucesso.`,
          ipAddress: ip,
        },
      });
    } catch (auditError) {
      console.error("[AuditLog Error]", auditError);
    }

    // 3. Salvar Sessão
    const session = await getSession();
    session.userId = user.userId;
    session.organizationId = user.organizationId;
    session.organizationNome = user.organizationNome;
    session.organizationSlug = user.organizationSlug;
    session.organizationSegmento = user.organizationSegmento;
    session.nome = user.nome;
    session.email = user.email;
    session.role = user.role;
    session.isDemoMode = user.role === "SUPER_ADMIN";

    await session.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return handleApiError(error, "Erro interno no servidor de autenticação.");
  }
}
