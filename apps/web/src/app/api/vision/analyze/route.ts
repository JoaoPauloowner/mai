import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { analyzeImage } from "@/lib/ai/vision";
import { handleApiError } from "@/lib/errors";
import { VisionAnalyzeSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = VisionAnalyzeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos para análise de imagem", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType, contexto } = parseResult.data;

    const resultado = await analyzeImage(
      imageBase64,
      mimeType,
      contexto
    );

    return NextResponse.json({ success: true, analise: resultado });
  } catch (error: any) {
    return handleApiError(error, "Falha ao processar análise visual por IA.");
  }
}
