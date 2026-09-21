import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { analyzeImage } from "@/lib/ai/vision";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { imageBase64, mimeType, contexto } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "A imagem em base64 é obrigatória" },
        { status: 400 }
      );
    }

    const resultado = await analyzeImage(
      imageBase64,
      mimeType || "image/jpeg",
      contexto || "AUTOMOTIVO"
    );

    return NextResponse.json({ success: true, analise: resultado });
  } catch (error: any) {
    console.error("Erro na API de visão:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
