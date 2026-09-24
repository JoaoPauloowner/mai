import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { plano = "pro", billingType = "PIX" } = body;

    const asaasApiKey = process.env.ASAAS_API_KEY;
    const asaasBaseUrl =
      process.env.ASAAS_ENV === "production"
        ? "https://api.asaas.com/v3"
        : "https://sandbox.asaas.com/api/v3";

    // Valores dos planos do OmniSDR
    const planoValores: Record<string, number> = {
      starter: 297.0,
      pro: 497.0,
      enterprise: 997.0,
    };
    const valor = planoValores[plano] || 497.0;

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organização não encontrada" }, { status: 404 });
    }

    if (!asaasApiKey) {
      // Modo de demonstração / local sem chave Asaas
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: "Chave ASAAS_API_KEY não configurada. Em ambiente local, a simulação de checkout foi liberada.",
        paymentUrl: `/dashboard?billing=demo_success&plano=${plano}`,
      });
    }

    // 1. Criar ou recuperar cliente no Asaas
    const customerRes = await fetch(`${asaasBaseUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: asaasApiKey,
      },
      body: JSON.stringify({
        name: org.nome,
        email: session.email,
        phone: org.whatsappNumber || undefined,
        cpfCnpj: org.cnpj || undefined,
        notificationDisabled: false,
      }),
    });

    const customerData = await customerRes.json();
    const customerId = customerData.id;

    // 2. Criar cobrança / assinatura no Asaas
    const paymentRes = await fetch(`${asaasBaseUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: asaasApiKey,
      },
      body: JSON.stringify({
        customer: customerId,
        billingType, // "PIX", "CREDIT_CARD", "BOLETO"
        value: valor,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        description: `Assinatura OmniSDR B2B - Plano ${plano.toUpperCase()}`,
      }),
    });

    const paymentData = await paymentRes.json();

    return NextResponse.json({
      success: true,
      paymentId: paymentData.id,
      invoiceUrl: paymentData.invoiceUrl,
      bankSlipUrl: paymentData.bankSlipUrl,
      pixQrCode: paymentData.pixQrCodeUrl,
    });
  } catch (error: any) {
    console.error("[Asaas Checkout Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
