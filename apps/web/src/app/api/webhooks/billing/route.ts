import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Webhook universal de pagamentos e assinaturas (Asaas / Stripe / Mercado Pago)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.event || body.type; // "PAYMENT_RECEIVED", "invoice.payment_succeeded"
    const customerEmail = body.payment?.customerEmail || body.data?.object?.customer_email;
    const organizationSlug = body.organizationSlug || body.externalReference;

    console.log(`[Billing Webhook] Evento recebido: ${eventType} para ${organizationSlug || customerEmail}`);

    if (organizationSlug) {
      const org = await prisma.organization.findUnique({
        where: { slug: organizationSlug },
      });

      if (org) {
        if (
          eventType === "PAYMENT_RECEIVED" ||
          eventType === "invoice.payment_succeeded" ||
          eventType === "PAYMENT_CONFIRMED"
        ) {
          await prisma.organization.update({
            where: { id: org.id },
            data: { statusPlano: "ativo" },
          });
        } else if (
          eventType === "PAYMENT_OVERDUE" ||
          eventType === "customer.subscription.deleted"
        ) {
          await prisma.organization.update({
            where: { id: org.id },
            data: { statusPlano: "inadimplente" },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro no Webhook de Billing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
