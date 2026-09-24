import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      select: {
        instagramHandle: true,
        instagramConnected: true,
        instagramKeywordsJson: true,
      },
    });

    let keywords = ["QUERO", "DESCONTO", "SIMULAR", "ATENDIMENTO"];
    if (org?.instagramKeywordsJson) {
      try {
        keywords = JSON.parse(org.instagramKeywordsJson);
      } catch {
        // default
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${appUrl}/api/webhooks/instagram`;

    return NextResponse.json({
      instagramHandle: org?.instagramHandle || "@minhaempresa",
      instagramConnected: Boolean(org?.instagramConnected),
      keywords,
      webhookUrl,
      verifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || "",
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
    const { action, instagramHandle, keywords } = body;

    if (action === "CONNECT") {
      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          instagramHandle: instagramHandle || "@minhaempresa",
          instagramConnected: true,
          instagramKeywordsJson: keywords ? JSON.stringify(keywords) : undefined,
        },
      });

      return NextResponse.json({ success: true, organization: updated });
    }

    if (action === "UPDATE_KEYWORDS") {
      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          instagramKeywordsJson: JSON.stringify(keywords || []),
        },
      });

      return NextResponse.json({ success: true, organization: updated });
    }

    if (action === "DISCONNECT") {
      const updated = await prisma.organization.update({
        where: { id: session.organizationId },
        data: {
          instagramConnected: false,
        },
      });

      return NextResponse.json({ success: true, organization: updated });
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
