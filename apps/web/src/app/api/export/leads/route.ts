import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Calcular filtro de data baseado no período
    const now = new Date();
    let startDate = new Date();
    if (period === "7d") startDate.setDate(now.getDate() - 7);
    else if (period === "30d") startDate.setDate(now.getDate() - 30);
    else if (period === "3m") startDate.setMonth(now.getMonth() - 3);
    else if (period === "6m") startDate.setMonth(now.getMonth() - 6);
    else if (period === "1y") startDate.setFullYear(now.getFullYear() - 1);
    else startDate.setDate(now.getDate() - 30);

    const leads = await prisma.lead.findMany({
      where: {
        organizationId: session.organizationId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
    });

    // Gerar CSV com formatação UTF-8 e delimitador padrão
    const headers = [
      "ID",
      "Nome",
      "Telefone",
      "Email",
      "Empresa",
      "Status",
      "Score",
      "Prioridade",
      "Origem Canal",
      "UTM Source",
      "UTM Campaign",
      "Valor Negocio",
      "Data Cadastro",
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${(l.nome || "").replace(/"/g, '""')}"`,
      `"${(l.telefone || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.empresa || "").replace(/"/g, '""')}"`,
      l.status,
      l.score,
      l.prioridade,
      l.origemCanal,
      `"${(l.utmSource || "").replace(/"/g, '""')}"`,
      `"${(l.utmCampaign || "").replace(/"/g, '""')}"`,
      l.valorNegocio || 0,
      l.createdAt.toISOString(),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${period}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao exportar leads" }, { status: 500 });
  }
}
