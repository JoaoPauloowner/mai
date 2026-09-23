import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizePhone, hashPhone } from "@/lib/compliance";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const organizationId = session.organizationId;

    const { leads } = await req.json();

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: "Nenhum registro fornecido para importação" },
        { status: 400 }
      );
    }

    let inseridos = 0;
    let duplicados = 0;

    for (const item of leads) {
      const nome = item.nome?.trim() || "Lead Importado";
      const rawTelefone = String(item.telefone || "").trim();

      if (!rawTelefone) continue;

      const normalized = normalizePhone(rawTelefone);
      const sha256 = hashPhone(normalized);

      // Checa se já existe na organização
      const existing = await prisma.lead.findFirst({
        where: {
          organizationId: session.organizationId,
          telefoneHash: sha256,
        },
      });

      if (existing) {
        duplicados++;
        continue;
      }

      await prisma.lead.create({
        data: {
          organizationId: organizationId,
          nome,
          telefone: normalized,
          telefoneHash: sha256,
          email: item.email?.trim() || null,
          status: "NOVO",
          score: 60,
          scoreJustificativa: "Lead importado via lote CSV com telefone validado E.164",
          origemCanal: "CSV",
          ramoInteresse: item.ramoInteresse || "Base de Contatos",
          valorNegocio: item.valorNegocio ? Number(item.valorNegocio) : 0,
        },
      });

      inseridos++;
    }

    return NextResponse.json({
      success: true,
      totalRecebido: leads.length,
      inseridos,
      duplicados,
    });
  } catch (error: any) {
    console.error("Erro ao importar leads:", error);
    return NextResponse.json(
      { error: "Falha interna ao processar importação" },
      { status: 500 }
    );
  }
}
