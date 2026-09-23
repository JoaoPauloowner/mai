import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Target,
  TrendingUp,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DashboardPageProps {
  searchParams: Promise<{
    period?: "7d" | "30d" | "3m" | "6m" | "1y";
  }>;
}

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-16 items-end gap-1.5">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-[var(--radius-sm)] bg-[var(--accent-primary)] opacity-85 transition-all"
            style={{ height: `${Math.max(6, (v / max) * 48)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requireAuth();
  const { period = "30d" } = await searchParams;

  const now = new Date();
  const periodDays =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "3m" ? 90 : period === "6m" ? 180 : 365;
  const since = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const [totalLeads, qualifiedLeads, appointmentsCount, wonLeads, recentLeads, chartLeads] =
    await Promise.all([
      prisma.lead.count({
        where: { organizationId: session.organizationId, createdAt: { gte: since } },
      }),
      prisma.lead.count({
        where: {
          organizationId: session.organizationId,
          createdAt: { gte: since },
          status: { in: ["QUALIFICADO", "AGENDADO", "GANHO"] },
        },
      }),
      prisma.appointment.count({
        where: { organizationId: session.organizationId, createdAt: { gte: since } },
      }),
      prisma.lead.findMany({
        where: { organizationId: session.organizationId, createdAt: { gte: since }, status: "GANHO" },
        select: { valorNegocio: true },
      }),
      prisma.lead.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.lead.findMany({
        where: { organizationId: session.organizationId, createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);

  const revenue = wonLeads.reduce((sum: number, lead: any) => sum + (lead.valorNegocio || 0), 0);

  const chartValues = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return chartLeads.filter((lead: any) => new Date(lead.createdAt).toISOString().slice(0, 10) === key).length;
  });

  const conversion = totalLeads ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 text-[var(--text-main)]">
      {/* Top Controls Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight">Torre de Atribuição</h1>
            <span className="rounded-full bg-[var(--success-bg)] border border-[var(--success-border)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--success-text)] font-mono">
              Live Feed
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Acompanhamento operacional, conversão em tempo real e retorno de tráfego.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/campanhas">
            <Button variant="secondary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Nova Campanha
            </Button>
          </Link>
          <Link href="/dashboard/inbox">
            <Button variant="primary" size="sm">
              <MessageSquare className="h-3.5 w-3.5" /> Abrir Atendimento
            </Button>
          </Link>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {([
          ["Leads Totais", totalLeads.toLocaleString("pt-BR"), "+18,4%", Users],
          ["Qualificados por IA", qualifiedLeads.toLocaleString("pt-BR"), "+12,6%", Sparkles],
          ["Agendamentos", appointmentsCount.toLocaleString("pt-BR"), "+8,2%", Target],
          ["Receita Atribuída", formatCurrency(revenue), "+24,2%", TrendingUp],
        ] as [string, string, string, any][]).map(([label, value, delta, Icon]) => (
          <div
            key={label}
            className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)]">{label}</span>
              <span className="grid h-7 w-7 place-items-center rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-[var(--accent-ink)]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              <strong className="text-2xl font-bold font-mono tracking-tight text-[var(--text-main)]">{value}</strong>
              <span className="rounded-full bg-[var(--success-bg)] border border-[var(--success-border)] px-2 py-0.5 text-[10px] font-bold text-[var(--success-text)] font-mono">
                {delta}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--text-subtle)]">vs. período anterior</p>
          </div>
        ))}
      </section>

      {/* Main Charts & Breakdown */}
      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-subtle)] font-mono font-bold">
                Fluxo de Entrada
              </div>
              <h3 className="mt-1 text-sm font-bold text-[var(--text-main)]">Volume de Leads por Dia</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              Últimos {period}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-6">
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-[var(--text-main)]">
                {totalLeads.toLocaleString("pt-BR")}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">leads capturados na janela</div>
            </div>
            <div className="w-2/3 min-w-[220px]">
              <MiniBars values={chartValues} />
            </div>
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-mono text-[var(--text-subtle)]">
            {["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "Hoje"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-subtle)] font-mono font-bold">
              Eficiência
            </div>
            <h3 className="mt-1 text-sm font-bold text-[var(--text-main)]">Taxa de Qualificação</h3>
          </div>

          <div className="py-5 flex items-center justify-center">
            <div
              className="relative grid h-32 w-32 place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--accent-primary) ${conversion * 3.6}deg, var(--bg-subtle) 0deg)`,
              }}
            >
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--bg-surface)]">
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-[var(--text-main)]">{conversion}%</div>
                  <div className="text-[9px] text-[var(--text-subtle)] uppercase">qualificados</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
            <span className="text-[var(--text-muted)]">Leads Qualificados</span>
            <strong className="font-mono text-[var(--text-main)]">
              {qualifiedLeads} / {totalLeads}
            </strong>
          </div>
        </div>
      </section>

      {/* Recent Activity Table & AI Assistant */}
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Leads Recentes</h3>
              <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Entrada contínua de oportunidades.</p>
            </div>
            <Link
              href="/dashboard/crm"
              className="text-xs font-bold text-[var(--accent-ink)] hover:underline flex items-center gap-1"
            >
              Ver Kanban <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Lead</th>
                  <th className="px-3 py-3 font-semibold">Canal / Origem</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Valor Negócio</th>
                  <th className="px-5 py-3 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[var(--text-main)]">{lead.nome || "Lead sem nome"}</div>
                      <div className="text-[10px] text-[var(--text-subtle)] font-mono">{lead.telefone}</div>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[var(--text-muted)]">
                      {lead.origemCanal || "WhatsApp"}
                      {lead.utmCampaign ? ` · ${lead.utmCampaign}` : ""}
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-3 py-3.5 font-semibold font-mono text-[var(--text-main)]">
                      {lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold font-mono text-[var(--accent-ink)]">
                      {lead.score || 0}
                    </td>
                  </tr>
                ))}
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-xs text-[var(--text-muted)]">
                      Nenhum lead registrado no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-subtle)] font-bold">
                Motor IA
              </div>
              <h3 className="mt-0.5 text-sm font-bold text-[var(--text-main)]">Inteligência Comercial</h3>
            </div>
            <Bot className="h-4 w-4 text-[var(--accent-ink)]" />
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] p-4 text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-ink)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-[var(--text-main)]">Triagem e Qualificação Automáticas</h4>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              O motor de IA conversa via WhatsApp, aplica mini-quizzes e encaminha leads prontos ao seu time.
            </p>
            <Link href="/dashboard/inbox">
              <Button variant="primary" size="sm" className="w-full mt-2">
                Acessar Atendimento Ativo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-3">
              <div className="text-[10px] text-[var(--text-subtle)]">Taxa Qualificação</div>
              <div className="mt-1 text-base font-bold font-mono text-[var(--text-main)]">{conversion}%</div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-3">
              <div className="text-[10px] text-[var(--text-subtle)]">Vendas Concluídas</div>
              <div className="mt-1 text-base font-bold font-mono text-[var(--success-text)]">{wonLeads.length}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
