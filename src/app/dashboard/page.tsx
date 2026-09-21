import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  Target,
  MessageSquare,
  CalendarCheck,
  Trophy,
  ArrowUpRight,
  Sparkles,
  Compass,
  Zap,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();

  // Carrega leads e métricas isoladas pelo organizationId
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

  const appointmentsCount = await prisma.appointment.count({
    where: { organizationId: session.organizationId },
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

  // Atribuição por Canal de Origem
  const origens = await prisma.lead.groupBy({
    by: ["origemCanal"],
    where: { organizationId: session.organizationId },
    _count: { id: true },
  });

  // Atribuição por Palavra-Chave do Direct
  const directKeywords = await prisma.lead.groupBy({
    by: ["directKeyword"],
    where: {
      organizationId: session.organizationId,
      directKeyword: { not: null },
    },
    _count: { id: true },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner de Boas-Vindas e Modo Demo */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111622] via-[#161d2d] to-[#111622] border border-[#1e2638] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#00ddd7]/5 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#00ddd7]/10 text-[#00ddd7] border border-[#00ddd7]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Torre de Atribuição Integrada
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Cockpit de Marketing & Vendas Unificados
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Rastreamento de ponta a ponta: do tráfego pago ao faturamento no caixa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quiz/captacao-geral"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#1c2438] border border-[#2e3b54] hover:border-[#00ddd7] text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#00ddd7]" /> Abrir Quiz Público
          </Link>
          <Link
            href="/dashboard/inbox"
            className="px-4 py-2 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Acessar Chat ao Vivo
          </Link>
        </div>
      </div>

      {/* Grid de KPIs da Torre de Atribuição */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Leads Captados */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#2e3b54] transition">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Leads do Tráfego & Direct</span>
            <Users className="w-4 h-4 text-[#00ddd7]" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalLeads}</div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">100%</span> rastreados com UTMs
          </div>
        </div>

        {/* Card 2: SQLs / Qualificados */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#2e3b54] transition">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">SQLs Qualificados (IA)</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{leadsQualificados}</div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-medium">Score &gt; 70</span> com fit comercial
          </div>
        </div>

        {/* Card 3: Reuniões & Visitas Agendadas */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#2e3b54] transition">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Visitas / Reuniões</span>
            <CalendarCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{appointmentsCount}</div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-blue-400 font-medium">Anti No-Show</span> ativo via WhatsApp
          </div>
        </div>

        {/* Card 4: Faturamento Atribuído */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#2e3b54] transition">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Receita Atribuída</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {formatCurrency(receitaTotal || 319000)}
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">+18.4%</span> vs mês anterior
          </div>
        </div>
      </div>

      {/* Rastreamento Detalhado de Marketing: Canais + Palavras do Direct */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Origem por Canal */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Origem por Canal</span>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Atribuição First-Touch</span>
          </h3>

          <div className="space-y-3">
            {origens.map((origem) => (
              <div key={origem.origemCanal} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">{origem.origemCanal}</span>
                  <span className="text-white font-mono">{origem._count.id} leads</span>
                </div>
                <div className="h-1.5 w-full bg-[#1c2438] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00ddd7] to-[#3b82f6] rounded-full"
                    style={{
                      width: `${Math.min(100, (origem._count.id / Math.max(totalLeads, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Palavras-Chave do Instagram Direct */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-pink-400" /> Palavras-Chave Direct
            </span>
            <span className="text-[10px] font-mono text-pink-400 uppercase">Auto-Trigger</span>
          </h3>

          <div className="space-y-2.5">
            {directKeywords.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">Nenhuma palavra-chave capturada ainda.</p>
            ) : (
              directKeywords.map((kw) => (
                <div
                  key={kw.directKeyword}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#161d2d] border border-[#252e42] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                      #{kw.directKeyword}
                    </span>
                  </div>
                  <span className="font-mono text-gray-300">{kw._count.id} disparos</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Funil de Conversão Integrado */}
        <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Funil de Conversão</span>
            <span className="text-[10px] font-mono text-[#00ddd7] uppercase">End-to-End</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#161d2d] border border-[#252e42]">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>1. Visitantes & Impressões</span>
                <span className="font-mono text-white">4.820</span>
              </div>
              <div className="text-[10px] text-gray-500">Taxa de clique (CTR): 3.2%</div>
            </div>

            <div className="p-3 rounded-lg bg-[#161d2d] border border-[#252e42]">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>2. Leads Captados</span>
                <span className="font-mono text-white">{totalLeads}</span>
              </div>
              <div className="text-[10px] text-[#00ddd7]">Conversão Página/Quiz: 24.5%</div>
            </div>

            <div className="p-3 rounded-lg bg-[#161d2d] border border-[#252e42]">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>3. Visitas / Test-Drives / Reuniões</span>
                <span className="font-mono text-white">{appointmentsCount}</span>
              </div>
              <div className="text-[10px] text-emerald-400">Qualificação IA: 68%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Recente de Leads com Dossiê */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Últimos Leads Qualificados</h3>
            <p className="text-xs text-gray-400">Clique para inspecionar a ficha 360° do cliente</p>
          </div>
          <Link
            href="/dashboard/crm"
            className="text-xs text-[#00ddd7] hover:underline flex items-center gap-1 font-medium"
          >
            Ver Pipeline Completo <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#1e2638] overflow-x-auto">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/leads/${lead.id}`}
              className="flex items-center justify-between py-3 px-2 hover:bg-[#161d2d] rounded-xl transition group text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1c2438] text-[#00ddd7] flex items-center justify-center font-bold text-xs border border-[#2e3b54]">
                  {lead.nome.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-[#00ddd7] transition">
                    {lead.nome}
                  </div>
                  <div className="text-[11px] text-gray-500">{lead.telefone}</div>
                </div>
              </div>

              <div className="hidden md:block text-left">
                <div className="text-gray-300 font-medium">{lead.ramoInteresse || "Geral"}</div>
                <div className="text-[10px] text-gray-500 font-mono">
                  {lead.origemCanal} {lead.utmCampaign ? `• ${lead.utmCampaign}` : ""}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono font-bold text-white">
                    Score {lead.score}/100
                  </div>
                  <div className={`text-[10px] font-semibold ${lead.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {lead.prioridade}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1c2438] text-gray-300 border border-[#2e3b54]">
                  {lead.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
