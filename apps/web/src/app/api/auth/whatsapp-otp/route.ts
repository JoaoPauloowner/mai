import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

// Envio de OTP via Meta WhatsApp Cloud API v20.0
async function sendWhatsAppOtp(phone: string, code: string) {
  const metaToken = process.env.META_ACCESS_TOKEN;
  const phoneId = process.env.META_PHONE_NUMBER_ID;

  if (!metaToken || !phoneId) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[WhatsApp OTP Dev Mode] Código para ${phone}: ${code}`);
    }
    return { sent: false, reason: "META_ACCESS_TOKEN_NOT_CONFIGURED" };
  }

  try {
    const cleanTo = phone.replace(/\D/g, "");
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${metaToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanTo,
        type: "text",
        text: {
          preview_url: false,
          body: `🔒 *Seu código de acesso ao Omni Service SaaS é:* *${code}*\n\nEle expira em 10 minutos. Nunca compartilhe este código.`,
        },
      }),
    });

    const data = await res.json();
    return { sent: res.ok, data };
  } catch (err: any) {
    console.error("[WhatsApp OTP Error]", err);
    return { sent: false, error: err.message };
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const { allowed } = checkRateLimit(`otp:${ip}`, 5, 10 * 60 * 1000); // 5 requisições por 10 min por IP

    if (!allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de verificação por WhatsApp. Tente novamente em alguns minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { telefone, action } = body;

    if (!telefone) {
      return NextResponse.json(
        { error: "Número de WhatsApp é obrigatório." },
        { status: 400 }
      );
    }

    const cleanPhone = telefone.replace(/\D/g, "");

    // 1. Gerar e salvar código OTP no banco de dados
    if (action === "REQUEST_CODE") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutos

      // Upsert no banco de dados (substitui o Map em memória)
      await prisma.otpVerification.upsert({
        where: { telefone: cleanPhone },
        update: { code, expiresAt },
        create: { telefone: cleanPhone, code, expiresAt },
      });

      // Disparo real via Meta WhatsApp API
      await sendWhatsAppOtp(cleanPhone, code);

      const isMetaConfigured = Boolean(process.env.META_ACCESS_TOKEN && process.env.META_PHONE_NUMBER_ID);

      return NextResponse.json({
        success: true,
        message: isMetaConfigured
          ? "Código de verificação enviado para o seu WhatsApp."
          : "Meta WhatsApp API não configurada. Use o código de teste gerado abaixo.",
        debugCode: !isMetaConfigured ? code : undefined,
      });
    }

    // 2. Validação do código OTP consultando o banco de dados
    if (action === "VERIFY_CODE") {
      const { code } = body;

      const stored = await prisma.otpVerification.findUnique({
        where: { telefone: cleanPhone },
      });

      if (!stored) {
        return NextResponse.json(
          { error: "Nenhum código solicitado para este número ou código expirado." },
          { status: 400 }
        );
      }

      if (new Date() > stored.expiresAt) {
        await prisma.otpVerification.delete({ where: { telefone: cleanPhone } });
        return NextResponse.json(
          { error: "Código expirado. Solicite um novo código." },
          { status: 400 }
        );
      }

      if (stored.code !== code?.trim()) {
        return NextResponse.json(
          { error: "Código incorreto. Verifique o WhatsApp e tente novamente." },
          { status: 400 }
        );
      }

      // Código válido: apaga o registro no banco
      await prisma.otpVerification.delete({ where: { telefone: cleanPhone } });

      return NextResponse.json({
        success: true,
        verified: true,
        message: "WhatsApp verificado com sucesso!",
      });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
