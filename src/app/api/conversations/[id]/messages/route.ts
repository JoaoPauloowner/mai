import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: conversationId } = await context.params;
    const body = await req.json();
    const { conteudo, tipoConteudo = "TEXTO", audioDuration } = body;

    if (!conteudo) {
      return NextResponse.json(
        { error: "Conteúdo da mensagem é obrigatório" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.organizationId !== session.organizationId) {
      return NextResponse.json(
        { error: "Conversa não encontrada" },
        { status: 404 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        remetenteTipo: "HUMANO",
        tipoConteudo,
        conteudo,
        audioDuration: audioDuration ? Number(audioDuration) : null,
        statusEnvio: "ENVIADO",
      },
    });

    // Atualiza timestamp da conversa
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { ultimoContato: new Date() },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Falha interna ao processar mensagem" },
      { status: 500 }
    );
  }
}
