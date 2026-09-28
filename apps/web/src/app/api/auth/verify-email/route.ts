import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, code, email } = body;

    if (!token && (!code || !email)) {
      return NextResponse.json(
        { error: "Informe o link de ativação ou o código de 6 dígitos e seu e-mail." },
        { status: 400 }
      );
    }

    let verificationRecord = null;

    // 1. Busca por Token (Magic Link)
    if (token) {
      verificationRecord = await prisma.emailVerification.findUnique({
        where: { token: token.trim() },
      });
    } 
    // 2. Busca por Código + E-mail
    else if (code && email) {
      const cleanEmail = email.trim().toLowerCase();
      verificationRecord = await prisma.emailVerification.findUnique({
        where: { email: cleanEmail },
      });

      if (verificationRecord && verificationRecord.code !== code.trim()) {
        return NextResponse.json(
          { error: "Código de ativação incorreto. Verifique sua caixa de entrada e tente novamente." },
          { status: 400 }
        );
      }
    }

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Link ou código de confirmação inválido ou já utilizado." },
        { status: 400 }
      );
    }

    // Verifica expiração
    if (new Date() > verificationRecord.expiresAt) {
      await prisma.emailVerification.delete({
        where: { id: verificationRecord.id },
      });
      return NextResponse.json(
        { error: "Código ou link expirado. Por favor, solicite um novo envio." },
        { status: 400 }
      );
    }

    // Marca o usuário como verificado
    const updatedUser = await prisma.user.update({
      where: { email: verificationRecord.email },
      data: { emailVerificado: true },
      include: { organization: true },
    });

    // Remove token do banco
    await prisma.emailVerification.delete({
      where: { id: verificationRecord.id },
    });

    // Atualiza sessão se o usuário estiver logado
    const session = await getSession();
    if (session.userId === updatedUser.id) {
      await session.save();
    }

    return NextResponse.json({
      success: true,
      message: "E-mail verificado e ativado com sucesso!",
      user: {
        email: updatedUser.email,
        nome: updatedUser.nome,
        emailVerificado: true,
      },
    });
  } catch (error: any) {
    console.error("[Verify Email Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
