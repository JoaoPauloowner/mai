import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/compliance";
import { createOrFetchInstanceQrCode } from "@/lib/evolution";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      select: {
        whatsappNumber: true,
        whatsappTipoConexao: true,
        whatsappStatus: true,
        metaPhoneNumberId: true,
        metaWabaId: true,
        metaAccessToken: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${appUrl}/api/webhooks/whatsapp`;
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "";

    return NextResponse.json({
      config: org,
      webhookUrl,
      verifyToken,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // 1. Conexão via Meta Cloud API / Embedded
    if (action === "SAVE_META") {
      const { metaPhoneNumberId, metaWabaId, metaAccessToken, whatsappNumber } = body;

      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          whatsappTipoConexao: "META_CLOUD_API",
          whatsappStatus: "CONNECTED",
          metaPhoneNumberId,
          metaWabaId,
          metaAccessToken,
          whatsappNumber: whatsappNumber ? normalizePhone(whatsappNumber) : undefined,
        },
      });

      return NextResponse.json({ success: true, organization: updated });
    }

    // 2. Conexão via QR Code (Evolution API v2 / Baileys)
    if (action === "FETCH_QR" || action === "CONNECT_QR") {
      const org = await prisma.organization.findUnique({
        where: { id: session.organizationId },
        select: { slug: true, whatsappNumber: true },
      });

      const instanceName = `omni_${org?.slug || session.organizationId}`;
      const evolutionData = await createOrFetchInstanceQrCode(instanceName);

      if (action === "CONNECT_QR" && evolutionData.status === "connected") {
        await prisma.organization.update({
          where: { id: session.organizationId },
          data: {
            whatsappTipoConexao: "QR_CODE",
            whatsappStatus: "CONNECTED",
          },
        });
      }

      return NextResponse.json({
        success: true,
        evolution: evolutionData,
      });
    }

    // 3. Desconectar WhatsApp
    if (action === "DISCONNECT") {
      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          whatsappStatus: "DISCONNECTED",
        },
      });

      return NextResponse.json({ success: true, organization: updated });
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
