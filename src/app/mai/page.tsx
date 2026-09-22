"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  MessageSquare,
  Target,
  Users,
  ShieldCheck,
  Clock,
  Check,
  X,
  Bot,
  BarChart3,
  Phone,
  Sparkles,
  ChevronDown,
  Star,
} from "lucide-react";

export default function LandingPage() {
  const [leadsPerDay, setLeadsPerDay] = useState(30);
  const [ticketMedio, setTicketMedio] = useState(3000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const leadsPorMes = leadsPerDay * 30;
  const leadsPerdidos = Math.round(leadsPorMes * 0.45);
  const vendasRecuperadas = Math.max(1, Math.round(leadsPerdidos * 0.08));
  const faturamentoRecuperado = vendasRecuperadas * ticketMedio;
  const mensalidade = 997;
  const roiMultiplicador = Math.round(faturamentoRecuperado / mensalidade);

  const faqs = [
    {
      q: "Em quanto tempo a plataforma fica ativa?",
      a: "Em média 10 a 15 minutos após o cadastro. A conexão com o WhatsApp é via QR Code ou WhatsApp Business API oficial.",
    },
    {
      q: "Funciona para qual tipo de negócio?",
      a: "Para qualquer segmento que receba leads pelo WhatsApp e invista em tráfego pago: automotivo, clínicas, seguros, imobiliário, escritórios contábeis e outros.",
    },
    {
      q: "Preciso saber programar para usar?",
      a: "Não. Toda a configuração é feita pelo painel visual. Em casos avançados, a equipe MAI faz o onboarding junto com você.",
    },
    {
      q: "Tem contrato de fidelidade?",
      a: "Não. O plano é mensal e pode ser cancelado a qualquer momento, sem multa.",
    },
    {
      q: "Meus dados e leads ficam seguros?",
      a: "Sim. Os dados são armazenados em servidores brasileiros, com criptografia end-to-end e conformidade total com a LGPD.",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      titulo: "Resposta Imediata em ≤ 30 Segundos",
      desc: "O MAI intercepta o lead no clique do anúncio e responde em segundos — antes do concorrente.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      titulo: "Triagem Inteligente com Mini-Quiz",
      desc: "Aplica perguntas de qualificação automaticamente, filtrando leads frios antes de chegar ao vendedor.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      titulo: "Atribuição de Tráfego Pago",
      desc: "Rastreia UTMs de Meta Ads e Google Ads até a conversa e devolve conversões offline ao Ads.",
    },
    {
      icon: <Bot className="w-5 h-5" />,
      titulo: "IA com Voz Humana (PTT)",
      desc: "Responde com áudios gravados com voz real ou IA, elevando taxa de resposta e engajamento.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      titulo: "CRM Kanban Integrado",
      desc: "Pipeline visual de negócios conectado às conversas do WhatsApp, sem precisar de outra ferramenta.",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      titulo: "Ligações VAPI com IA de Voz",
      desc: "Quando o lead não responde ao WhatsApp, o MAI liga automaticamente com voz de IA natural.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#2C2E2A] font-sans antialiased selection:bg-[#C1ED84] selection:text-[#2C2E2A]">

      {/* ─── NAVBAR ─── */}
      <header className="h-16 bg-white border-b border-[#E0E3DE] sticky top-0 z-50 px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C2E2A] text-[#C1ED84] font-extrabold text-lg flex items-center justify-center shadow-sm">
              Ω
            </div>
            <span className="font-serif font-bold text-[#2C2E2A] text-lg leading-none">MAI</span>
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7EBE6] text-[#7A8E75] border border-[#D0D5CD]">
              Motor de Atendimento & Inteligência
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#63695B]">
            <a href="#como-funciona" className="hover:text-[#2C2E2A] transition">Como funciona</a>
            <a href="#calculadora" className="hover:text-[#2C2E2A] transition">Calculadora</a>
            <a href="#planos" className="hover:text-[#2C2E2A] transition">Planos</a>
            <a href="#faq" className="hover:text-[#2C2E2A] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/mai/login" className="px-4 py-2 text-xs font-semibold text-[#63695B] hover:text-[#2C2E2A] transition">
              Entrar
            </Link>
            <Link
              href="/mai/cadastro"
              className="px-5 py-2.5 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] text-xs font-bold transition border border-[#A5DC60] shadow-xs flex items-center gap-1.5"
            >
              Começar Grátis <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="pt-20 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0E3DE] text-xs font-mono text-[#7A8E75] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C1ED84] animate-pulse" />
            Atribuição de leads · WhatsApp → Google Ads · LGPD
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#2C2E2A] leading-[1.07]">
            Seu tráfego pago está respondendo em{" "}
            <span className="relative inline-block">
              <span className="relative z-10">14 segundos</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#C1ED84] -z-0 opacity-60 rounded" />
            </span>
            {" "}— ou não.
          </h1>

          <p className="text-base text-[#63695B] leading-relaxed max-w-2xl mx-auto">
            O <strong className="text-[#2C2E2A]">MAI</strong> intercepta o lead no instante do clique, aplica um mini-quiz de triagem, responde com <strong className="text-[#2C2E2A]">voz de IA ou texto personalizado</strong> e devolve ao Google Ads como conversão offline — fechando o ciclo de atribuição do tráfego pago ao WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/mai/cadastro"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2C2E2A] hover:bg-[#3D4038] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              Ativar Meu Atendimento Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quiz/omni-demo"
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-[#E0E3DE] hover:border-[#7A8E75] hover:bg-[#F5F5F5] text-[#2C2E2A] font-bold text-sm transition flex items-center justify-center gap-2"
            >
              Testar a IA no Celular →
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-xs text-[#63695B]">
            {["Sem fidelidade", "Ativação em 10 min", "LGPD Compliant", "WhatsApp Oficial"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8E75]" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Mockup Dashboard ── */}
        <div className="mt-16 rounded-2xl border border-[#E0E3DE] bg-white shadow-[0_20px_50px_rgba(44,46,42,0.1)] overflow-hidden max-w-5xl mx-auto">
          {/* Barra de título do browser */}
          <div className="h-10 bg-[#F5F5F5] border-b border-[#E0E3DE] px-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E9BEC4]" />
            <span className="w-3 h-3 rounded-full bg-[#F5D9A8]" />
            <span className="w-3 h-3 rounded-full bg-[#DDE8DE]" />
            <span className="ml-3 text-[11px] text-[#7C8472] font-mono">mai-cockpit.app/dashboard</span>
          </div>

          {/* Cards de KPI mockados */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Leads Hoje", value: "47", delta: "+12%", color: "text-[#2D6A4F]" },
              { label: "Tempo Médio Resp.", value: "18s", delta: "-31%", color: "text-[#2D6A4F]" },
              { label: "Taxa de Qualif.", value: "63%", delta: "+8%", color: "text-[#2D6A4F]" },
              { label: "CPL Meta Ads", value: "R$ 4,20", delta: "-18%", color: "text-[#2D6A4F]" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE]">
                <div className="text-[11px] text-[#7C8472] font-medium mb-2">{kpi.label}</div>
                <div className="text-2xl font-extrabold font-mono text-[#2C2E2A]">{kpi.value}</div>
                <div className={`text-[11px] font-bold mt-1 ${kpi.color}`}>{kpi.delta} vs ontem</div>
              </div>
            ))}
          </div>

          {/* Funil de conversão */}
          <div className="px-6 pb-6">
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-2">
              <div className="text-xs font-bold text-[#2C2E2A] mb-3">Funil de Atribuição — Últimos 30 dias</div>
              {[
                { label: "Cliques no Anúncio", value: 1240, pct: 100 },
                { label: "Leads Iniciaram Chat", value: 387, pct: 31 },
                { label: "Qualificados pela IA", value: 212, pct: 17 },
                { label: "Enviados ao Vendedor", value: 98, pct: 8 },
                { label: "Enviados ao Google Ads", value: 43, pct: 3, lime: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 text-[11px] text-[#63695B]">{row.label}</div>
                  <div className="flex-1 h-2 bg-[#E0E3DE] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${row.lime ? "bg-[#C1ED84]" : "bg-[#D0D5CD]"}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#2C2E2A] w-10 text-right">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">Como funciona</span>
          <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
            Do clique ao fechamento — em segundos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              titulo: "Lead clica no anúncio",
              desc: "Meta Ads ou Google Ads dispara o UTM. O MAI captura a origem exata do clique.",
              icon: <Target className="w-5 h-5 text-[#7A8E75]" />,
            },
            {
              num: "02",
              titulo: "IA responde em ≤ 30s",
              desc: "Mini-quiz de triagem automático com texto, áudio ou voz de IA natural via WhatsApp.",
              icon: <Bot className="w-5 h-5 text-[#7A8E75]" />,
            },
            {
              num: "03",
              titulo: "Conversão devolvida ao Ads",
              desc: "Leads qualificados são enviados ao Google Ads como conversão offline com ROAS real.",
              icon: <BarChart3 className="w-5 h-5 text-[#7A8E75]" />,
            },
          ].map((step) => (
            <div key={step.num} className="bg-white border border-[#E0E3DE] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E7EBE6] flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-mono text-[11px] font-bold text-[#7C8472] uppercase tracking-wider">
                  Passo {step.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2E2A]">{step.titulo}</h3>
              <p className="text-sm text-[#63695B] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6 bg-white border-y border-[#E0E3DE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">Funcionalidades</span>
            <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
              Tudo que a operação precisa, em um lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.titulo} className="p-5 rounded-2xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E7EBE6] text-[#7A8E75] flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-serif font-bold text-[#2C2E2A] text-base leading-snug">{f.titulo}</h3>
                <p className="text-xs text-[#63695B] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CALCULADORA DE CAIXA ─── */}
      <section id="calculadora" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">Calculadora de Caixa</span>
          <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
            Quanto dinheiro você está perdendo agora?
          </h2>
          <p className="text-sm text-[#63695B] mt-3">
            Ajuste os números do seu negócio e veja o impacto real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-white border border-[#E0E3DE] rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-[#2C2E2A]">Leads por dia via WhatsApp</label>
                <span className="text-xl font-extrabold font-mono text-[#2C2E2A]">{leadsPerDay}</span>
              </div>
              <input
                type="range" min={5} max={200} step={5}
                value={leadsPerDay}
                onChange={(e) => setLeadsPerDay(Number(e.target.value))}
                className="w-full accent-[#C1ED84] h-2 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-[#7C8472] mt-1">
                <span>5</span><span>200</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-[#2C2E2A]">Ticket médio de venda (R$)</label>
                <span className="text-xl font-extrabold font-mono text-[#2C2E2A]">
                  R$ {ticketMedio.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range" min={500} max={50000} step={500}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full accent-[#C1ED84] h-2 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-[#7C8472] mt-1">
                <span>R$ 500</span><span>R$ 50.000</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2C2E2A] text-white rounded-2xl p-6 space-y-5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C1ED84] mb-2">
              Diagnóstico de Caixa — MAI Engine
            </div>

            {[
              { label: "Leads perdidos/mês por demora", value: `${leadsPerdidos}`, sub: "estimativa conservadora de 45%" },
              { label: "Vendas recuperáveis com IA", value: `${vendasRecuperadas}`, sub: "com resposta ≤ 30s" },
              { label: "Faturamento recuperado/mês", value: `R$ ${faturamentoRecuperado.toLocaleString("pt-BR")}`, sub: "potencial direto", highlight: true },
              { label: "ROI estimado do MAI", value: `${roiMultiplicador}x`, sub: `vs. mensalidade de R$ ${mensalidade}`, highlight: true },
            ].map((row) => (
              <div key={row.label} className={`pb-4 border-b border-white/10 last:border-0 last:pb-0 ${row.highlight ? "pt-1" : ""}`}>
                <div className="text-[11px] text-white/60">{row.label}</div>
                <div className={`text-3xl font-extrabold font-mono mt-1 ${row.highlight ? "text-[#C1ED84]" : "text-white"}`}>
                  {row.value}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">{row.sub}</div>
              </div>
            ))}

            <Link
              href="/mai/cadastro"
              className="block w-full text-center py-3.5 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-sm transition border border-[#A5DC60] mt-2"
            >
              Recuperar Esse Faturamento Agora →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPARATIVO ─── */}
      <section id="planos" className="py-20 px-6 bg-white border-y border-[#E0E3DE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">Comparativo</span>
            <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
              MAI vs. o jeito antigo
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E0E3DE]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E3DE] bg-[#F5F5F5]">
                  <th className="text-left p-4 text-xs font-bold text-[#63695B]">Critério</th>
                  <th className="text-center p-4 text-xs font-bold text-[#63695B]">Sem MAI</th>
                  <th className="text-center p-4 text-xs font-bold text-[#2C2E2A] bg-[#F0FADC]">Com MAI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tempo de resposta ao lead", "20–60 min", "≤ 30 segundos"],
                  ["Qualificação automática", "Manual, inconsistente", "Quiz de IA automático"],
                  ["Atribuição do tráfego pago", "Não existe", "UTM → WhatsApp → Ads"],
                  ["Relatório de CPL real", "Estimado / achismo", "Dashboard em tempo real"],
                  ["Ligações automáticas VAPI", "Impossível", "IA de voz nativa"],
                  ["Conformidade com LGPD", "Depende de planilhas", "Nativo no sistema"],
                ].map(([criterio, sem, com]) => (
                  <tr key={criterio} className="border-b border-[#E0E3DE] last:border-0">
                    <td className="p-4 text-xs text-[#2C2E2A] font-medium">{criterio}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-[#9B2226]">
                        <X className="w-3.5 h-3.5" /> {sem}
                      </div>
                    </td>
                    <td className="p-4 text-center bg-[#F0FADC]/50">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-[#2D6A4F] font-bold">
                        <Check className="w-3.5 h-3.5" /> {com}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Planos */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starter */}
            <div className="bg-[#F5F5F5] border border-[#E0E3DE] rounded-2xl p-6 space-y-4">
              <div>
                <div className="text-[11px] font-mono uppercase text-[#7A8E75] tracking-wider">Starter</div>
                <div className="font-serif text-3xl font-bold text-[#2C2E2A] mt-1">R$ 497<span className="text-sm font-normal text-[#63695B]">/mês</span></div>
                <p className="text-xs text-[#63695B] mt-1">Para negócios iniciando a automação</p>
              </div>
              {["1 número de WhatsApp", "Quiz de triagem por IA", "CRM Kanban integrado", "Dashboard de atribuição básico", "Suporte via chat"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-[#2C2E2A]">
                  <Check className="w-3.5 h-3.5 text-[#7A8E75] shrink-0" /> {f}
                </div>
              ))}
              <Link href="/mai/cadastro" className="block w-full text-center py-3 rounded-xl border border-[#E0E3DE] bg-white hover:bg-[#F5F5F5] text-[#2C2E2A] font-bold text-sm transition mt-2">
                Começar com Starter
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-[#2C2E2A] border border-[#3D4038] rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#C1ED84] text-[#2C2E2A] text-[10px] font-bold uppercase tracking-wider">
                Mais Popular
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-[#C1ED84] tracking-wider">Pro</div>
                <div className="font-serif text-3xl font-bold text-white mt-1">R$ 997<span className="text-sm font-normal text-white/60">/mês</span></div>
                <p className="text-xs text-white/50 mt-1">Para operações comerciais completas</p>
              </div>
              {[
                "Tudo do Starter +",
                "3 números de WhatsApp",
                "Ligações VAPI com IA de voz",
                "Atribuição avançada (UTM → Google Ads)",
                "Relatórios exportáveis",
                "Onboarding dedicado",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-white/90">
                  <Check className="w-3.5 h-3.5 text-[#C1ED84] shrink-0" /> {f}
                </div>
              ))}
              <Link href="/mai/cadastro" className="block w-full text-center py-3 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-sm transition border border-[#A5DC60] mt-2">
                Ativar Plano Pro →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">Depoimentos</span>
          <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
            O que dizem as operações ativas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              nome: "Carlos E.",
              cargo: "Diretor Comercial — AutoPrime",
              texto: "Antes demorávamos 40 minutos para responder. Com o MAI, o lead recebe uma mensagem e um áudio em menos de 20 segundos. O índice de agendamentos subiu 31%.",
            },
            {
              nome: "Fernanda M.",
              cargo: "Sócia — Apex Corretora de Seguros",
              texto: "O quiz de triagem eliminou 60% dos leads que nunca comprariam. Nosso time agora só fala com quem realmente quer contratar. CPL caiu pela metade.",
            },
            {
              nome: "Ricardo S.",
              cargo: "CEO — ContabFlow Assessoria",
              texto: "A integração com o Google Ads foi o divisor de águas. Agora sabemos com precisão qual campanha converte em cliente, não só em clique.",
            },
          ].map((t) => (
            <div key={t.nome} className="bg-white border border-[#E0E3DE] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#C1ED84]">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm text-[#63695B] leading-relaxed italic">"{t.texto}"</p>
              <div className="border-t border-[#E0E3DE] pt-3">
                <div className="font-bold text-xs text-[#2C2E2A]">{t.nome}</div>
                <div className="text-[11px] text-[#7C8472]">{t.cargo}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 px-6 bg-white border-t border-[#E0E3DE]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A8E75]">FAQ</span>
            <h2 className="font-serif text-4xl font-bold text-[#2C2E2A] mt-2 tracking-tight">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-[#E0E3DE] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5F5F5] transition"
                >
                  <span className="text-sm font-bold text-[#2C2E2A]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7C8472] shrink-0 transition-transform ${activeFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[#63695B] leading-relaxed border-t border-[#E0E3DE] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-[#2C2E2A] rounded-2xl p-12 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#C1ED84] text-[11px] font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Sem contrato · Cancele quando quiser
          </div>
          <h2 className="font-serif text-4xl font-bold tracking-tight">
            Pronto para fechar mais com o mesmo tráfego pago?
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto">
            Ative o MAI hoje e veja os primeiros leads sendo respondidos em menos de 30 segundos — ainda nessa semana.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/mai/cadastro"
              className="px-10 py-4 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-sm transition border border-[#A5DC60] flex items-center gap-2 shadow-md"
            >
              Criar Minha Conta Gratuita <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/quiz/omni-demo"
              target="_blank"
              className="px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10 font-bold text-sm transition"
            >
              Ver Demo ao Vivo →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#E0E3DE] bg-white py-8 px-6 text-center text-xs text-[#7C8472]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2C2E2A] text-[#C1ED84] font-extrabold text-sm flex items-center justify-center">
              Ω
            </div>
            <span className="font-serif font-bold text-[#2C2E2A]">MAI — Omni Service SaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/mai/login" className="hover:text-[#2C2E2A] transition">Entrar</Link>
            <Link href="/mai/cadastro" className="hover:text-[#2C2E2A] transition">Criar Conta</Link>
            <a href="#faq" className="hover:text-[#2C2E2A] transition">FAQ</a>
          </div>
          <span>© 2025 MAI · LGPD Compliant · Todos os direitos reservados</span>
        </div>
      </footer>
    </div>
  );
}
