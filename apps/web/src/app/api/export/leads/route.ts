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

    function sanitizeCsvCell(value: any): string {
      if (value === null || value === undefined) return '""';
      let str = String(value);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    }

    const rows = leads.map((l: any) => [
      sanitizeCsvCell(l.id),
      sanitizeCsvCell(l.nome),
      sanitizeCsvCell(l.telefone),
      sanitizeCsvCell(l.email),
      sanitizeCsvCell(l.empresa),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.score),
      sanitizeCsvCell(l.prioridade),
      sanitizeCsvCell(l.origemCanal),
      sanitizeCsvCell(l.utmSource),
      sanitizeCsvCell(l.utmCampaign),
      sanitizeCsvCell(l.valorNegocio || 0),
      sanitizeCsvCell(l.createdAt.toISOString()),
    ]);

    const csvContent = "\uFEFF" + [headers.map(sanitizeCsvCell).join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");

    // M9: Registra auditoria de exportação
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: session.organizationId,
          userId: session.userId,
          acao: "LEAD_DATA_EXPORT",
          detalhes: `Exportação de ${leads.length} leads em CSV pelo usuário ${session.nome} (Período: ${period}).`,
        },
      });
    } catch {}

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${period}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao exportar leads." }, { status: 500 });
  }
}
