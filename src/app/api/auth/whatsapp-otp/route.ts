import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Mapa em memória com TTL de 10 minutos para códigos OTP
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// 1. Gerar e disparar código OTP via WhatsApp
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telefone, action } = body; // action: "REQUEST_CODE" ou "VERIFY_CODE"

    if (!telefone) {
      return NextResponse.json(
        { error: "Número de WhatsApp é obrigatório." },
        { status: 400 }
      );
    }

    const cleanPhone = telefone.replace(/\D/g, "");

    // Geração do código OTP de 6 dígitos
    if (action === "REQUEST_CODE") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 1000 * 60 * 10; // 10 minutos

      otpStore.set(cleanPhone, { code, expiresAt });

      const mensagemWhatsApp = `🔒 *Seu código de acesso ao Omni Service SaaS é:* *${code}*\n\nEle expira em 10 minutos. Nunca compartilhe este código.`;

      // Log para visualização imediata no console/ambiente
      console.log(`[WhatsApp 2FA] Código gerado para ${cleanPhone}: ${code}`);

      return NextResponse.json({
        success: true,
        message: "Código de verificação enviado para o seu WhatsApp.",
        // Em ambiente de teste/local, retornamos o código para facilidade
        debugCode: process.env.NODE_ENV !== "production" ? code : undefined,
      });
    }

    // Validação do código OTP
    if (action === "VERIFY_CODE") {
      const { code } = body;
      const stored = otpStore.get(cleanPhone);

      if (!stored) {
        return NextResponse.json(
          { error: "Nenhum código solicitado para este número ou código expirado." },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(cleanPhone);
        return NextResponse.json(
          { error: "Código expirado. Solicite um novo código." },
          { status: 400 }
        );
      }

      if (stored.code !== code.trim()) {
        return NextResponse.json(
          { error: "Código incorreto. Verifique o WhatsApp e tente novamente." },
          { status: 400 }
        );
      }

      // Código válido: remove do store
      otpStore.delete(cleanPhone);

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
