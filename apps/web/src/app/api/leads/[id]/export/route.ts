import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.userId || !session.organizationId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    const lead = await prisma.lead.findFirst({
      where: { id, organizationId: session.organizationId },
      include: {
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
        appointments: {
          orderBy: { dataHorario: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead não encontrado ou não pertence a esta organização." },
        { status: 404 }
      );
    }

    // Registra AuditLog da exportação para conformidade com LGPD Art. 18
    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.userId,
        acao: "LEAD_DATA_EXPORTED_LGPD",
        detalhes: `Exportação de dados pessoais e histórico do lead "${lead.nome}" (ID: ${lead.id}) realizada por ${session.nome} sob conformidade LGPD.`,
      },
    });

    const exportPayload = {
      termoLGPD: "Relatório de Portabilidade de Dados Pessoais (LGPD - Lei 13.709/2018, Art. 18)",
      dataExportacao: new Date().toISOString(),
      lead: {
        id: lead.id,
        nome: lead.nome,
        telefone: lead.telefone,
        email: lead.email,
        empresa: lead.empresa,
        ramoInteresse: lead.ramoInteresse,
        status: lead.status,
        prioridade: lead.prioridade,
        score: lead.score,
        origemCanal: lead.origemCanal,
        utmSource: lead.utmSource,
        utmCampaign: lead.utmCampaign,
        utmMedium: lead.utmMedium,
        quizAnswers: lead.quizAnswersJson ? JSON.parse(lead.quizAnswersJson) : null,
        notasInternas: lead.notasInternasJson ? JSON.parse(lead.notasInternasJson) : null,
        resumoIa: lead.resumoIa,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      },
      agendamentos: lead.appointments.map((a) => ({
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao,
        dataHorario: a.dataHorario,
        status: a.status,
        tipo: a.tipo,
        createdAt: a.createdAt,
      })),
      conversas: lead.conversations.map((c) => ({
        id: c.id,
        canal: c.canal,
        status: c.status,
        ultimoContato: c.ultimoContato,
        mensagens: c.messages.map((m) => ({
          id: m.id,
          remetente: m.remetenteTipo,
          conteudo: m.conteudo,
          tipoConteudo: m.tipoConteudo,
          data: m.createdAt,
        })),
      })),
    };

    return NextResponse.json(exportPayload);
  } catch (error: any) {
    return handleApiError(error, "Falha ao exportar dados do lead sob a LGPD.");
  }
}
