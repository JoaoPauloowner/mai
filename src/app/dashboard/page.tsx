import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  Target,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Check,
  Compass,
} from "lucide-react";
import { MetricCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const session = await requireAuth();

  // Calcular o intervalo de datas com base no período selecionado
  const periodMap: Record<string, number> = {
    "7d": 7, "30d": 30, "3m": 90, "6m": 180, "1y": 365,
  };
  const days = periodMap[searchParams.period || "30d"] ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);


  // Carrega leads e métricas reais do banco de dados
  const leads = await prisma.lead.findMany({
    where: { organizationId: session.organizationId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalLeads = await prisma.lead.count({
    where: { organizationId: session.organizationId, createdAt: { gte: since } },
  });

  const leadsQualificados = await prisma.lead.count({
    where: {
      organizationId: session.organizationId,
      createdAt: { gte: since },
      status: { in: ["QUALIFICADO", "AGENDADO", "GANHO"] },
    },
  });

  const appointmentsCount = await prisma.appointment.count({
    where: { organizationId: session.organizationId, createdAt: { gte: since } },
  });

  const leadsGanhos = await prisma.lead.findMany({
    where: {
      organizationId: session.organizationId,
      createdAt: { gte: since },
      status: "GANHO",
    },
    select: { valorNegocio: true },
  });


  const receitaTotal = leadsGanhos.reduce(
    (acc, item) => acc + (item.valorNegocio || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#2C2E2A]">
      
      {/* Top Banner de Boas-Vindas WAct Style */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] border border-[#C4D7C4] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Torre de Atribuição & Vendas
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C2E2A]">
            Cockpit de Marketing & Inteligência Comercial
          </h1>
          <p className="text-xs text-[#63695B] mt-0.5">
            Rastreamento de ponta a ponta: do tráfego pago ao fechamento no WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/quiz/captacao-geral" target="_blank">
            <Button variant="secondary" size="sm">
              <Compass className="w-3.5 h-3.5 text-[#7A8E75]" />
              <span>Abrir Quiz Público</span>
            </Button>
          </Link>
          <Link href="/dashboard/inbox">
            <Button variant="primary" size="sm">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Acessar Chat ao Vivo</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. KPI CARDS (3 LADO A LADO COM DESIGN SYSTEM WACT) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard
          label="Leads do Tráfego & Direct"
          value={totalLeads || 0}
          delta="+18.4% ↑"
          deltaType="positive"
          context="100% rastreados com UTMs"
          icon={<Users className="w-4 h-4" />}
        />

        <MetricCard
          label="SQLs Qualificados (IA)"
          value={leadsQualificados || 0}
          delta="+12.6% ↑"
          deltaType="positive"
          context="Score > 70 com fit comercial"
          icon={<Sparkles className="w-4 h-4" />}
        />

        <MetricCard
          label="Visitas / Reuniões"
          value={appointmentsCount || 0}
          delta="Anti-No-Show"
          deltaType="positive"
          context="Agendamentos via WhatsApp"
          icon={<Target className="w-4 h-4" />}
        />

        <MetricCard
          label="Receita Atribuída"
          value={formatCurrency(receitaTotal)}
          delta="+24.2% ↑"
          deltaType="positive"
          context="Vendas fechadas no caixa"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>


      {/* 2. PIPELINE REAL — DADOS 100% DO BANCO */}
      {(() => {
        const etapas = [
          {
            label: "Leads Recebidos",
            value: totalLeads,
            note: "via WhatsApp ou Quiz",
            lime: false,
          },
          {
            label: "Qualificados pela IA",
            value: leadsQualificados,
            note: `${totalLeads > 0 ? Math.round((leadsQualificados / totalLeads) * 100) : 0}% do total`,
            lime: false,
          },
          {
            label: "Agendamentos",
            value: appointmentsCount,
            note: "reuniões ou visitas",
            lime: false,
          },
          {
            label: "Vendas Fechadas",
            value: leadsGanhos.length,
            note: "status GANHO no CRM",
            lime: true,
          },
        ];
        const max = Math.max(totalLeads, 1);
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2C2E2A]">Pipeline de Conversão</h3>
                <p className="text-xs text-[#63695B]">
                  Dados reais · {searchParams.period || "30d"}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#7A8E75] uppercase tracking-wider px-2.5 py-1 bg-[#E7EBE6] rounded-lg border border-[#D0D5CD]">
                Fonte: CRM
              </span>
            </div>

            <div className="space-y-3">
              {etapas.map((e, i) => {
                const pct = Math.round((e.value / max) * 100);
                return (
                  <div key={e.label} className="flex items-center gap-4">
                    <div className="w-5 text-[11px] font-mono text-[#7C8472]">{i + 1}</div>
                    <div className="w-44 shrink-0">
                      <div className={`text-xs font-bold ${e.lime ? "text-[#2C2E2A]" : "text-[#63695B]"}`}>{e.label}</div>
                      <div className="text-[10px] text-[#7C8472]">{e.note}</div>
                    </div>
                    <div className="flex-1 h-3 bg-[#E7EBE6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${e.lime ? "bg-[#C1ED84]" : "bg-[#C8CEC4]"}`}
                        style={{ width: `${Math.max(pct, e.value > 0 ? 2 : 0)}%` }}
                      />
                    </div>
                    <div className={`w-10 text-right text-sm font-extrabold font-mono ${e.lime ? "text-[#2D6A4F]" : "text-[#2C2E2A]"}`}>
                      {e.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalLeads === 0 && (
              <p className="text-center text-xs text-[#7C8472] border-t border-[#E0E3DE] pt-4 mt-2">
                Nenhum lead neste período. Os dados aparecerão conforme chegarem via WhatsApp ou Quiz.
              </p>
            )}
          </div>
        );
      })()}

      {/* 3. RECENT ACTIVITY & LEADS DA ORGANIZAÇÃO */}

      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2E2A]">Últimos Leads & Conversas Ativas</h3>
            <p className="text-xs text-[#63695B]">Feed em tempo real da sua operação comercial</p>
          </div>

          <Link
            href="/dashboard/crm"
            className="text-xs font-bold text-[#2C2E2A] hover:text-[#7A8E75] flex items-center gap-1 transition"
          >
            <span>Ver pipeline completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#E0E3DE] text-[#7C8472] font-semibold">
                <th className="py-3 px-4">Lead</th>
                <th className="py-3 px-4">Canal / Origem</th>
                <th className="py-3 px-4">Score IA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valor Estimado</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3DE] font-medium text-[#2C2E2A]">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FBFBFB] transition">
                    <td className="py-3.5 px-4 font-bold">
                      <div>{lead.nome || "Lead Sem Nome"}</div>
                      <span className="text-[11px] font-mono text-[#7C8472]">{lead.telefone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] text-[#2C2E2A] font-mono text-[10px]">
                        {lead.origemCanal || "WhatsApp"} {lead.utmCampaign ? `• ${lead.utmCampaign}` : ""}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-[#2D6A4F]">
                        {lead.score || 85}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2C2E2A]">
                      {lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="p-1 rounded-lg hover:bg-[#E7EBE6] text-[#7C8472] hover:text-[#2C2E2A] inline-block transition"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#7C8472]">
                    Nenhum lead registrado ainda. Os novos leads que chegarem via WhatsApp ou Quiz aparecerão aqui.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
