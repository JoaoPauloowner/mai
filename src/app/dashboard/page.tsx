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
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();

  // Carrega leads e métricas reais
  const leads = await prisma.lead.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalLeads = await prisma.lead.count({
    where: { organizationId: session.organizationId },
  });

  const leadsQualificados = await prisma.lead.count({
    where: {
      organizationId: session.organizationId,
      status: { in: ["QUALIFICADO", "AGENDADO", "GANHO"] },
    },
  });

  const leadsGanhos = await prisma.lead.findMany({
    where: {
      organizationId: session.organizationId,
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
      
      {/* 1. KPI CARDS (3 LADO A LADO [VISTO NO BEHANCE]) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Qualified Leads */}
        <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#63695B] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7EBE6] text-[#7A8E75] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-[#2C2E2A]">Qualified Leads</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-[11px] font-bold font-mono border border-[#C4D7C4]">
              +5.6% ↑
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#2C2E2A]">{leadsQualificados || 180}</div>
              <span className="text-[11px] text-[#7C8472]">Qualified Leads</span>
            </div>
            {/* Sparkline Verde WAct */}
            <div className="w-24 h-10 flex items-end">
              <div className="w-full h-8 bg-gradient-to-t from-[#DDE8DE]/80 to-transparent border-t-2 border-[#7A8E75] rounded-t" />
            </div>
          </div>
        </div>

        {/* Card 2: CPL (Cost per Lead) */}
        <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#63695B] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7EBE6] text-[#7A8E75] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-[#2C2E2A]">CPL (Cost per Lead)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-[11px] font-bold font-mono border border-[#C4D7C4]">
              -3.2% ↓
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#2C2E2A]">R$ 4,20</div>
              <span className="text-[11px] text-[#7C8472]">CPL (Meta & Google Ads)</span>
            </div>
            {/* Sparkline Vermelha/Descendente */}
            <div className="w-24 h-10 flex items-end">
              <div className="w-full h-8 bg-gradient-to-t from-[#E9BEC4]/40 to-transparent border-t-2 border-[#9B2226] rounded-t" />
            </div>
          </div>
        </div>

        {/* Card 3: Lead Quality Score */}
        <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#63695B] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7EBE6] text-[#7A8E75] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-[#2C2E2A]">Lead Quality Score</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-[11px] font-bold font-mono border border-[#C4D7C4]">
              +12.6% ↑
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#2C2E2A]">63.8%</div>
              <span className="text-[11px] text-[#7C8472]">Média de Fit Comercial</span>
            </div>
            {/* Sparkline Verde */}
            <div className="w-24 h-10 flex items-end">
              <div className="w-full h-8 bg-gradient-to-t from-[#DDE8DE]/80 to-transparent border-t-2 border-[#7A8E75] rounded-t" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. CONVERSION FUNNEL (BARRA HORIZONTAL WACT COM ÚLTIMA EM LIME [VISTO NO BEHANCE]) */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#2C2E2A]">Conversion Funnel</h3>
            <p className="text-xs text-[#63695B]">From click to qualified conversion sent to Meta / Google Ads</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] text-xs font-semibold text-[#63695B]">
              <span>Sources</span>
              <ChevronDown className="w-3 h-3 text-[#7C8472]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] text-xs font-semibold text-[#63695B]">
              <span>Last 6 months</span>
              <ChevronDown className="w-3 h-3 text-[#7C8472]" />
            </div>
          </div>
        </div>

        {/* Chips de Filtro Removíveis */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] font-semibold flex items-center gap-1.5">
            Google Ads - Campaign A <span className="cursor-pointer text-[#7C8472]">✕</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] font-semibold flex items-center gap-1.5">
            Meta Ads - Stories Conversão <span className="cursor-pointer text-[#7C8472]">✕</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] font-semibold flex items-center gap-1.5">
            WhatsApp Inbound <span className="cursor-pointer text-[#7C8472]">✕</span>
          </span>
        </div>

        {/* Funil de Barras Horizontais */}
        <div className="space-y-4 pt-2">
          
          {/* Linha 1: Clicks */}
          <div className="grid grid-cols-12 items-center gap-4 text-xs font-medium">
            <span className="col-span-2 text-[#63695B] font-semibold">Clicks</span>
            <span className="col-span-1 text-[#7C8472] font-mono">100%</span>
            <span className="col-span-1 font-bold font-mono text-[#2C2E2A]">2,400</span>
            <div className="col-span-8 flex items-center gap-3">
              <div className="flex-1 h-4 bg-[#E7EBE6] rounded-full overflow-hidden">
                <div className="h-full bg-[#B5BBAE] w-full rounded-full" />
              </div>
            </div>
          </div>

          {/* Linha 2: Leads */}
          <div className="grid grid-cols-12 items-center gap-4 text-xs font-medium">
            <span className="col-span-2 text-[#63695B] font-semibold">Leads</span>
            <span className="col-span-1 text-[#7C8472] font-mono">45%</span>
            <span className="col-span-1 font-bold font-mono text-[#2C2E2A]">320</span>
            <div className="col-span-8 flex items-center gap-3">
              <div className="w-[45%] h-4 bg-[#E7EBE6] rounded-full overflow-hidden">
                <div className="h-full bg-[#B5BBAE] w-full rounded-full" />
              </div>
              <span className="text-[11px] font-mono text-[#9B2226] font-semibold">-55% didn't open WhatsApp</span>
            </div>
          </div>

          {/* Linha 3: Verified / Quiz */}
          <div className="grid grid-cols-12 items-center gap-4 text-xs font-medium">
            <span className="col-span-2 text-[#63695B] font-semibold">Verified (Quiz)</span>
            <span className="col-span-1 text-[#7C8472] font-mono">20%</span>
            <span className="col-span-1 font-bold font-mono text-[#2C2E2A]">180</span>
            <div className="col-span-8 flex items-center gap-3">
              <div className="w-[25%] h-4 bg-[#E7EBE6] rounded-full overflow-hidden">
                <div className="h-full bg-[#B5BBAE] w-full rounded-full" />
              </div>
              <span className="text-[11px] font-mono text-[#8F5D18] font-semibold">-43.8% failed verification</span>
            </div>
          </div>

          {/* Linha 4: Source matched */}
          <div className="grid grid-cols-12 items-center gap-4 text-xs font-medium">
            <span className="col-span-2 text-[#63695B] font-semibold">Source matched</span>
            <span className="col-span-1 text-[#7C8472] font-mono">15%</span>
            <span className="col-span-1 font-bold font-mono text-[#2C2E2A]">150</span>
            <div className="col-span-8 flex items-center gap-3">
              <div className="w-[18%] h-4 bg-[#E7EBE6] rounded-full overflow-hidden">
                <div className="h-full bg-[#B5BBAE] w-full rounded-full" />
              </div>
              <span className="text-[11px] font-mono text-[#63695B] font-semibold">-16.7% lost source attribution</span>
            </div>
          </div>

          {/* Linha 5: Sent to Ads (DESTAQUE LIME #C1ED84) */}
          <div className="grid grid-cols-12 items-center gap-4 text-xs font-medium">
            <span className="col-span-2 text-[#2C2E2A] font-bold">Sent to Ads (CAPI)</span>
            <span className="col-span-1 text-[#2C2E2A] font-bold font-mono">6%</span>
            <span className="col-span-1 font-extrabold font-mono text-[#2C2E2A]">120</span>
            <div className="col-span-8 flex items-center gap-3">
              <div className="w-[12%] h-4 bg-[#E7EBE6] rounded-full overflow-hidden">
                <div className="h-full bg-[#C1ED84] w-full rounded-full border border-[#B2E372]" />
              </div>
              <span className="text-[11px] font-mono text-[#2D6A4F] font-bold">✓ Vendas Offline Atribuídas</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. SOURCES (TABELA DE FONTES DE TRÁFEGO [VISTO NO BEHANCE]) */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2E2A]">Sources</h3>
            <p className="text-xs text-[#63695B]">Performance breakdown by traffic source — click any row to drill down</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] font-semibold text-[#63695B] flex items-center gap-1">
              By spend <ChevronDown className="w-3 h-3" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] font-semibold text-[#63695B] flex items-center gap-1">
              Source type <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#E0E3DE] text-[#7C8472] font-semibold">
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4">Qualified</th>
                <th className="py-3 px-4">Q-rate</th>
                <th className="py-3 px-4">CPL</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3DE] font-medium text-[#2C2E2A]">
              <tr className="hover:bg-[#FBFBFB]">
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7A8E75]" /> Google Ads • Brand Campaign
                </td>
                <td className="py-3.5 px-4 font-mono">1,200</td>
                <td className="py-3.5 px-4 font-mono">180</td>
                <td className="py-3.5 px-4 font-mono">110</td>
                <td className="py-3.5 px-4 font-mono">61%</td>
                <td className="py-3.5 px-4 font-mono font-bold">R$ 3,80</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] font-bold text-[10px]">
                    Active
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#FBFBFB]">
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C1ED84]" /> Meta Ads • Lead Campaign (Instagram)
                </td>
                <td className="py-3.5 px-4 font-mono">800</td>
                <td className="py-3.5 px-4 font-mono">90</td>
                <td className="py-3.5 px-4 font-mono">45</td>
                <td className="py-3.5 px-4 font-mono">50%</td>
                <td className="py-3.5 px-4 font-mono font-bold">R$ 3,80</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] font-bold text-[10px]">
                    Active
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-[#FBFBFB]">
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAE2CA]" /> WhatsApp Direct / Orgânico
                </td>
                <td className="py-3.5 px-4 font-mono">400</td>
                <td className="py-3.5 px-4 font-mono">50</td>
                <td className="py-3.5 px-4 font-mono">25</td>
                <td className="py-3.5 px-4 font-mono">50%</td>
                <td className="py-3.5 px-4 font-mono font-bold">R$ 4,10</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E1D6AF] text-[#8F5D18] font-bold text-[10px]">
                    Pause
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY (FEED DE LEADS EM TEMPO REAL COM PILLS DE STATUS [VISTO NO BEHANCE]) */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2E2A]">Recent Activity</h3>
            <p className="text-xs text-[#63695B]">Live feed of incoming leads</p>
          </div>

          <Link
            href="/dashboard/crm"
            className="text-xs font-bold text-[#2C2E2A] hover:text-[#7A8E75] flex items-center gap-1"
          >
            <span>View all leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#E0E3DE] text-[#7C8472] font-semibold">
                <th className="py-3 px-4">Lead</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">TTC</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3DE] font-medium text-[#2C2E2A]">
              {leads.length > 0 ? (
                leads.map((lead, idx) => (
                  <tr key={lead.id} className="hover:bg-[#FBFBFB]">
                    <td className="py-3.5 px-4 font-bold">
                      <div>{lead.nome || "Lead Sem Nome"}</div>
                      <span className="text-[11px] font-mono text-[#7C8472]">{lead.telefone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] text-[#2C2E2A] font-mono text-[10px]">
                        {lead.origemCanal || "WhatsApp - Direct"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] font-bold text-[10px]">
                        {lead.status || "Verified"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#7C8472] font-mono">15 min ago</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2C2E2A]">9 min</td>
                    <td className="py-3.5 px-4 font-mono">R$ 4,20</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="p-1 rounded-lg hover:bg-[#E7EBE6] text-[#7C8472] hover:text-[#2C2E2A] inline-block"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-[#FBFBFB]">
                  <td className="py-3.5 px-4 font-bold">
                    <div>A. Tomland</div>
                    <span className="text-[11px] font-mono text-[#7C8472]">+55 (11) 98765-4321</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] border border-[#E0E3DE] text-[#2C2E2A] font-mono text-[10px]">
                      Campaign A
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] font-bold text-[10px]">
                      Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#7C8472] font-mono">15 min ago</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2C2E2A]">9 min</td>
                  <td className="py-3.5 px-4 font-mono">R$ 4,20</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded-lg hover:bg-[#E7EBE6] text-[#7C8472]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
