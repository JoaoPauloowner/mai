import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { chunkText, generateEmbedding } from "@/lib/embeddings";

export async function GET() {
  try {
    const session = await requireAuth();

    const documents = await prisma.knowledgeDocument.findMany({
      where: { organizationId: session.organizationId },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { titulo, tipo = "MANUAL", conteudoTexto } = body;

    if (!titulo || !conteudoTexto || conteudoTexto.trim().length === 0) {
      return NextResponse.json(
        { error: "Título e conteúdo do documento são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Criar o documento pai
    const document = await prisma.knowledgeDocument.create({
      data: {
        organizationId: session.organizationId,
        titulo,
        tipo,
        tamanhoBytes: Buffer.byteLength(conteudoTexto, "utf8"),
      },
    });

    // 2. Fatiar em chunks
    const chunks = chunkText(conteudoTexto);

    // 3. Gerar embeddings e salvar chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);

      await prisma.knowledgeChunk.create({
        data: {
          organizationId: session.organizationId,
          documentId: document.id,
          chunkIndex: i,
          conteudoTexto: chunk,
          embeddingJson: JSON.stringify(embedding),
        },
      });
    }

    // Atualizar contagem total de chunks
    await prisma.knowledgeDocument.update({
      where: { id: document.id },
      data: { totalChunks: chunks.length },
    });

    return NextResponse.json({
      success: true,
      documentId: document.id,
      totalChunks: chunks.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "ID do documento obrigatório" }, { status: 400 });
    }

    const doc = await prisma.knowledgeDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc || doc.organizationId !== session.organizationId) {
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    }

    await prisma.knowledgeDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
