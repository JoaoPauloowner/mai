import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowUpRight, BarChart3, Bot, ChevronRight, MessageSquare,
  MoreHorizontal, Plus, Sparkles, Target, TrendingUp, Users
} from "lucide-react";

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-24 items-end gap-2">
      {values.map((value, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <div
            className={`w-full max-w-5 rounded-t-md transition-all ${i === values.length - 1 ? "bg-[#2563EB]" : "bg-[#E5E5E2]"}`}
            style={{ height: `${Math.max(8, (value / max) * 82)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const session = await requireAuth();

  const periodMap: Record<string, number> = { "7d": 7, "30d": 30, "3m": 90, "6m": 180, "1y": 365 };
  const days = periodMap[searchParams.period || "30d"] ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [recentLeads, chartLeads, totalLeads, qualifiedLeads, appointmentsCount, wonLeads] =
    await Promise.all([
      prisma.lead.findMany({
        where: { organizationId: session.organizationId, createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.lead.findMany({
        where: { organizationId: session.organizationId, createdAt: { gte: since } },
        select: { createdAt: true },
        take: 500,
        orderBy: { createdAt: "asc" },
      }),
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
    ]);

  const revenue = wonLeads.reduce((sum, lead) => sum + (lead.valorNegocio || 0), 0);

  const chartValues = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return chartLeads.filter((lead) => new Date(lead.createdAt).toISOString().slice(0, 10) === key).length;
  });

  const conversion = totalLeads ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  const periodLabel = searchParams.period || "30d";

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 text-[#0F172A]">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-[-0.04em]">Dashboard</h1>
            <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">
              Live
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">Visão geral da operação comercial da sua organização.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/shoppers/dashboard/campanhas" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">
            <Plus className="h-3.5 w-3.5" /> Add widget
          </Link>
          <Link href="/shoppers/dashboard/inbox" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#2A2A2A]">
            <MessageSquare className="h-3.5 w-3.5" /> Abrir atendimento
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Leads", totalLeads.toLocaleString("pt-BR"), "+18,4%", Users],
          ["Qualificados", qualifiedLeads.toLocaleString("pt-BR"), "+12,6%", Sparkles],
          ["Agendamentos", appointmentsCount.toLocaleString("pt-BR"), "+8,2%", Target],
          ["Receita atribuída", formatCurrency(revenue), "+24,2%", TrendingUp],
        ].map(([label, value, delta, Icon]) => (
          <div key={String(label)} className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_8px_rgba(23,23,23,0.03)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">{label}</span>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#F8FAFC] text-[#2563EB]"><Icon className="h-3.5 w-3.5" /></span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              <strong className="text-[26px] font-semibold tracking-[-0.04em]">{value}</strong>
              <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-[9px] font-bold text-[#2563EB]">{delta}</span>
            </div>
            <p className="mt-2 text-[10px] text-[#9A9A94]">vs. período anterior</p>
          </div>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#9A9A94]">Performance</div>
              <h2 className="mt-1 text-sm font-semibold">Entrada de leads</h2>
            </div>
            <button className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#64748B]">
              Últimos {periodLabel} <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-5">
            <div>
              <div className="text-4xl font-semibold tracking-[-0.05em]">{totalLeads.toLocaleString("pt-BR")}</div>
              <div className="mt-1 text-[10px] text-[#9A9A94]">leads registrados no período</div>
            </div>
            <div className="w-2/3 min-w-[220px]"><MiniBars values={chartValues} /></div>
          </div>
          <div className="mt-3 flex justify-between text-[9px] text-[#94A3B8]">
            {["6d","5d","4d","3d","2d","1d","Hoje"].map((x) => <span key={x}>{x}</span>)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between">
            <div><div className="text-[10px] uppercase tracking-[0.15em] text-[#9A9A94]">Conversão</div><h2 className="mt-1 text-sm font-semibold">Qualificação dos leads</h2></div>
            <MoreHorizontal className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <div className="mt-7 flex items-center justify-center">
            <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#2563EB ${conversion * 3.6}deg, #F0F0ED 0deg)` }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white"><div className="text-center"><div className="text-3xl font-semibold">{conversion}%</div><div className="text-[9px] text-[#9A9A94]">qualificados</div></div></div>
            </div>
          </div>
          <div className="mt-5 flex justify-between border-t border-[#F0F0ED] pt-4 text-[10px]"><span className="text-[#64748B]">SQL / total</span><strong>{qualifiedLeads} / {totalLeads}</strong></div>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-xl border border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between border-b border-[#F0F0ED] px-5 py-4">
            <div><h2 className="text-sm font-semibold">Leads recentes</h2><p className="mt-0.5 text-[10px] text-[#9A9A94]">Acompanhe a atividade mais recente da operação.</p></div>
            <Link href="/shoppers/dashboard/crm" className="text-[10px] font-bold text-[#2563EB]">Ver pipeline <ArrowUpRight className="ml-0.5 inline h-3 w-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="border-b border-[#F0F0ED] bg-[#F8FAFC] text-[9px] uppercase tracking-[0.12em] text-[#9A9A94]">
                <tr><th className="px-5 py-3 font-semibold">Lead</th><th className="px-3 py-3 font-semibold">Origem</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Valor</th><th className="px-5 py-3 text-right font-semibold">Score</th></tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0ED]">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-5 py-3.5"><div className="font-semibold">{lead.nome || "Lead sem nome"}</div><div className="mt-0.5 text-[10px] text-[#9A9A94]">{lead.telefone}</div></td>
                    <td className="px-3 py-3.5 text-[10px] text-[#64748B]">{lead.origemCanal || "WhatsApp"}{lead.utmCampaign ? ` · ${lead.utmCampaign}` : ""}</td>
                    <td className="px-3 py-3.5"><span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[9px] font-semibold text-[#64748B]">{lead.status}</span></td>
                    <td className="px-3 py-3.5 font-semibold">{lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#2563EB]">{lead.score || 0}</td>
                  </tr>
                ))}
                {recentLeads.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-[#9A9A94]">Nenhum lead no período selecionado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[0.15em] text-[#9A9A94]">AI Assistant</div><h2 className="mt-1 text-sm font-semibold">Inteligência da operação</h2></div><Bot className="h-4 w-4 text-[#2563EB]" /></div>
          <div className="mt-6 rounded-xl bg-[#F8FAFC] p-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_8px_25px_rgba(255,106,42,0.16)]"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#2563EB] text-white"><Sparkles className="h-5 w-5" /></div></div>
            <h3 className="mt-4 text-sm font-semibold">Pronto para analisar.</h3>
            <p className="mx-auto mt-1 max-w-[220px] text-[10px] leading-5 text-[#64748B]">Pergunte sobre seus leads, campanhas, conversões ou oportunidades.</p>
            <Link href="/shoppers/dashboard/inbox" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3.5 py-2 text-[10px] font-bold text-white">Abrir atendimento <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[#E2E8F0] p-3"><div className="text-[9px] text-[#9A9A94]">Taxa de qualificação</div><div className="mt-1 text-sm font-semibold">{conversion}%</div></div>
            <div className="rounded-lg border border-[#E2E8F0] p-3"><div className="text-[9px] text-[#9A9A94]">Vendas</div><div className="mt-1 text-sm font-semibold">{wonLeads.length}</div></div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Operação comercial</h2><p className="mt-0.5 text-[10px] text-[#9A9A94]">Atalhos para as áreas mais usadas.</p></div><BarChart3 className="h-4 w-4 text-[#94A3B8]" /></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ["Caixa de entrada", "WhatsApp + Instagram", "/shoppers/dashboard/inbox", MessageSquare],
            ["CRM Kanban", "Pipeline e oportunidades", "/shoppers/dashboard/crm", Target],
            ["Campanhas", "UTMs e atribuição", "/shoppers/dashboard/campanhas", BarChart3],
          ].map(([title, description, href, Icon]) => (
            <Link key={String(title)} href={String(href)} className="group flex items-center gap-3 rounded-lg border border-[#E2E8F0] p-3.5 hover:border-[#FFB18A] hover:bg-[#FFF9F5]">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#F8FAFC] text-[#2563EB]"><Icon className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold">{String(title)}</span><span className="mt-0.5 block text-[10px] text-[#9A9A94]">{String(description)}</span></span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#2563EB]" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
