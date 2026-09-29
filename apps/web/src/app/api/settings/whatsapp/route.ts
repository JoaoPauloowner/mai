import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/compliance";
import { createOrFetchInstanceQrCode } from "@/lib/evolution";
import { handleApiError } from "@/lib/errors";

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

    const webhookUrl =
      process.env.META_WEBHOOK_URL ||
      (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/whatsapp` : "https://mai-production-e8ef.up.railway.app/api/webhooks/whatsapp");
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "omni_verify_token_2026";

    return NextResponse.json({
      config: org,
      webhookUrl,
      verifyToken,
    });
  } catch (error: any) {
    return handleApiError(error, "Falha ao consultar configurações do WhatsApp.");
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

    // 1.0 Embedded Signup — recebe accessToken do FB SDK e busca WABA/PhoneNumber automaticamente
    if (action === "EMBEDDED_SIGNUP") {
      const { accessToken } = body;
      if (!accessToken) {
        return NextResponse.json({ error: "accessToken não fornecido" }, { status: 400 });
      }

      // Busca WABAs associadas ao token
      const wabaRes = await fetch(
        `https://graph.facebook.com/v21.0/me/whatsapp_business_accounts?access_token=${accessToken}`
      );
      const wabaData = await wabaRes.json();

      if (!wabaData.data || wabaData.data.length === 0) {
        return NextResponse.json({ error: "Nenhuma conta WhatsApp Business encontrada para este token." }, { status: 400 });
      }

      const waba = wabaData.data[0];
      const wabaId = waba.id;

      // Busca números de telefone desta WABA
      const phonesRes = await fetch(
        `https://graph.facebook.com/v21.0/${wabaId}/phone_numbers?access_token=${accessToken}`
      );
      const phonesData = await phonesRes.json();

      if (!phonesData.data || phonesData.data.length === 0) {
        return NextResponse.json({ error: "Nenhum número de telefone encontrado na conta WABA." }, { status: 400 });
      }

      const phone = phonesData.data[0];
      const phoneNumberId = phone.id;
      const displayPhoneNumber = phone.display_phone_number;

      // Salva na organização
      await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          whatsappTipoConexao: "META_CLOUD_API",
          whatsappStatus: "CONNECTED",
          metaPhoneNumberId: phoneNumberId,
          metaWabaId: wabaId,
          metaAccessToken: accessToken,
          whatsappNumber: displayPhoneNumber ? normalizePhone(displayPhoneNumber) : undefined,
        },
      });

      return NextResponse.json({
        success: true,
        wabaId,
        phoneNumberId,
        displayPhoneNumber,
      });
    }

    // 1. Conexão via Meta Cloud API / Embedded (manual)
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

    // 1.1 Salvar número de WhatsApp Direto (para redirecionamento manual / wa.me)
    if (action === "SAVE_PHONE") {
      const { whatsappNumber } = body;

      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
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
    return handleApiError(error, "Falha ao processar configuração do WhatsApp.");
  }
}
