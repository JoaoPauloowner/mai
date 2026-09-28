import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateRealEmail } from "@/lib/disposable-emails";
import { generateEmailToken, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const { allowed } = checkRateLimit(`email_verify:${ip}`, 5, 10 * 60 * 1000); // 5 disparos a cada 10 min por IP

    if (!allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de envio. Aguarde alguns minutos antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.reason }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Localiza usuário
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nenhuma conta encontrada com este e-mail." },
        { status: 404 }
      );
    }

    if (user.emailVerificado) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Este e-mail já foi verificado anteriormente.",
      });
    }

    // Gera token e código
    const { token, code, expiresAt } = generateEmailToken();

    await prisma.emailVerification.upsert({
      where: { email: cleanEmail },
      update: { token, code, expiresAt },
      create: { email: cleanEmail, token, code, expiresAt },
    });

    const result = await sendVerificationEmail({
      to: cleanEmail,
      nome: user.nome,
      code,
      token,
    });

    return NextResponse.json({
      success: true,
      message: "E-mail de confirmação enviado com sucesso!",
      devMode: result.devMode,
      debugCode: result.devMode ? code : undefined,
      debugToken: result.devMode ? token : undefined,
    });
  } catch (error: any) {
    console.error("[Send Verification Email Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
