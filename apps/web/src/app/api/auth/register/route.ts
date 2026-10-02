import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { checkRateLimit, getTrustedClientIp } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/compliance";
import { validateRealEmail } from "@/lib/disposable-emails";
import { generateEmailToken, sendVerificationEmail } from "@/lib/email";
import { handleApiError } from "@/lib/errors";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const ip = getTrustedClientIp(req);
    
    // 1. Rate Limiting (3 cadastros por IP a cada 1 hora)
    const limit = await checkRateLimit(`register_${ip}`, 3, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Limite de cadastros excedido para este IP. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { empresaNome, nome, email, telefone, senha, codigoOtp } = body;

    if (!empresaNome || !nome || !email || !senha) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Validação estrita de veracidade de e-mail (bloqueia e-mails temporários/descartáveis)
    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.reason }, { status: 400 });
    }

    // Validação estrita de OTP se telefone for fornecido
    const trimmedPhone = typeof telefone === "string" ? telefone.trim() : "";
    if (trimmedPhone) {
      if (!codigoOtp || typeof codigoOtp !== "string" || !codigoOtp.trim()) {
        return NextResponse.json(
          { error: "Código de confirmação do WhatsApp (OTP) é obrigatório ao informar telefone." },
          { status: 400 }
        );
      }

      const normalizedWithPlus = normalizePhone(trimmedPhone);
      const cleanPhone = normalizedWithPlus.replace(/\D/g, "");
      const rawDigits = trimmedPhone.replace(/\D/g, "");

      const stored = await prisma.otpVerification.findFirst({
        where: {
          OR: [
            { telefone: cleanPhone },
            { telefone: rawDigits },
          ],
        },
      });

      if (!stored) {
        return NextResponse.json(
          { error: "Nenhum código de verificação ativo encontrado para este telefone. Solicite um novo código." },
          { status: 400 }
        );
      }

      if (new Date() > stored.expiresAt) {
        await prisma.otpVerification.deleteMany({
          where: {
            OR: [{ telefone: cleanPhone }, { telefone: rawDigits }],
          },
        });
        return NextResponse.json(
          { error: "Código expirado. Solicite um novo código." },
          { status: 400 }
        );
      }

      if (stored.code !== codigoOtp.trim()) {
        return NextResponse.json(
          { error: "Código de confirmação incorreto." },
          { status: 400 }
        );
      }

      // Remove o OTP utilizado após validação bem-sucedida
      await prisma.otpVerification.deleteMany({
        where: {
          OR: [{ telefone: cleanPhone }, { telefone: rawDigits }],
        },
      });
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
        whatsappNumber: telefone ? normalizePhone(telefone) : null,
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
        emailVerificado: false,
      },
    });

    // 6. Gera e envia e-mail de verificação de autenticidade
    try {
      const { token, code, expiresAt } = generateEmailToken();
      await prisma.emailVerification.upsert({
        where: { email: cleanEmail },
        update: { token, code, expiresAt },
        create: { email: cleanEmail, token, code, expiresAt },
      });

      await sendVerificationEmail({
        to: cleanEmail,
        nome: user.nome,
        code,
        token,
      });
    } catch (emailErr) {
      console.error("[Email Verification Init Error]", emailErr);
    }

    // 7. Grava no AuditLog (Item 8)
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

    // 8. Cria a Sessão Criptografada do novo cliente
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
      user: { id: user.id, email: user.email, nome: user.nome, emailVerificado: false },
      organization: { id: org.id, slug: org.slug, nome: org.nome },
    });
  } catch (error: any) {
    return handleApiError(error, "Falha ao registrar organização comercial.");
  }
}
