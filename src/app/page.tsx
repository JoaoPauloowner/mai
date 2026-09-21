"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  MessageSquare,
  Target,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
  Play,
  Star,
  ChevronRight,
  Phone,
  BarChart3,
  Flame,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [leadsPerDay, setLeadsPerDay] = useState(25);

  // Calculo de ROI estimado
  const extraSalesPerMonth = Math.round(leadsPerDay * 30 * 0.04); // 4% de conversao extra pela velocidade
  const avgTicket = 1500;
  const extraRevenue = extraSalesPerMonth * avgTicket;

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-[#00ddd7] selection:text-black">
      {/* 1. Header / Navbar */}
      <header className="h-20 border-b border-[#1e2638]/70 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] text-black font-black text-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,221,215,0.35)]">
            Ω
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            MAI <span className="text-[#00ddd7] text-xs font-mono font-normal uppercase ml-1 px-2 py-0.5 rounded-full bg-[#00ddd7]/10 border border-[#00ddd7]/30">Service SaaS</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-300">
          <a href="#solucoes" className="hover:text-[#00ddd7] transition">Recursos</a>
          <a href="#como-funciona" className="hover:text-[#00ddd7] transition">Como Funciona</a>
          <a href="#roi" className="hover:text-[#00ddd7] transition">Simulador de ROI</a>
          <a href="#planos" className="hover:text-[#00ddd7] transition">Planos & Preços</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#161d2d] transition"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-5 py-2.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition shadow-lg shadow-[#00ddd7]/20 flex items-center gap-1.5"
          >
            <span>Testar Grátis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Glow de Fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00ddd7]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111622] border border-[#252e42] text-xs font-mono text-gray-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#00ddd7] animate-pulse" />
          <span>Atendimento com IA em menos de 30 segundos no WhatsApp & Instagram</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Transforme Leads de Tráfego Pago em{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ddd7] via-cyan-300 to-[#3b82f6]">
            Vendas Fechadas no WhatsApp
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          O <strong>MAI</strong> combina Mini-Quizzes de alta conversão, atendimento com áudios humanizados de IA e um CRM Kanban que rastreia qual anúncio do Meta ou Google gerou o lucro da sua empresa.
        </p>

        {/* CTA Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-extrabold text-sm transition shadow-[0_0_30px_rgba(0,221,215,0.35)] flex items-center justify-center gap-2"
          >
            <span>Criar Conta e Começar Agora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/quiz/omni-demo"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#111622] hover:bg-[#161d2d] border border-[#252e42] hover:border-[#00ddd7] text-white font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-[#00ddd7]" />
            <span>Ver Demonstração ao Vivo</span>
          </Link>
        </div>

        {/* Provas e Selos */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Resposta em &lt; 30 Segundos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" />
            <span>Atribuição Total Meta & Google Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Áudios Gravados na Hora (PTT)</span>
          </div>
        </div>

        {/* Mockup Preview do Dashboard */}
        <div className="pt-12 relative max-w-5xl mx-auto">
          <div className="p-3 rounded-3xl bg-[#0a0d14] border border-[#1e2638] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="rounded-2xl bg-[#111622] border border-[#1e2638] overflow-hidden">
              {/* Top Bar Preview */}
              <div className="h-10 bg-[#0c101a] border-b border-[#1e2638] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono text-gray-400">app.mai-service.com.br/dashboard</span>
                <span className="text-[10px] font-mono text-emerald-400">● Live System</span>
              </div>

              {/* Grid Interno do Preview */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Card 1: Lead Score */}
                <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Lead Score IA</span>
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">95/100</div>
                  <p className="text-[11px] text-gray-300">Alta urgência de compra identificada no Mini-Quiz.</p>
                </div>

                {/* Card 2: WhatsApp Chat */}
                <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Chat WhatsApp com PTT</span>
                    <MessageSquare className="w-4 h-4 text-[#00ddd7]" />
                  </div>
                  <div className="text-xs bg-[#0c101a] p-2 rounded-lg border border-[#1e2638] text-gray-300">
                    🎙️ <em>"Olá Carlos! Já separei a condição exclusiva pra você..."</em>
                  </div>
                  <span className="text-[10px] text-[#00ddd7] font-mono block">Enviado em 14 segundos</span>
                </div>

                {/* Card 3: Atribuição */}
                <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Atribuição de Campanha</span>
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white truncate">reels_lancamento_q1</div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ROI 14.8x Confirmado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seção dos 4 Grandes Pilares */}
      <section id="solucoes" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1e2638]/60 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase text-[#00ddd7] tracking-wider">A Solução Completa</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Por que o MAI Fecha Mais Vendas que um Atendente Comum?
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Eliminamos os 4 maiores gargalos que fazem empresas perderem vendas todos os dias no WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] hover:border-[#00ddd7] transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#00ddd7]/10 border border-[#00ddd7]/30 text-[#00ddd7] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Speed-to-Lead Imediato</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              O lead manda mensagem e recebe resposta qualificada em menos de 30 segundos, 24 horas por dia, 7 dias por semana.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] hover:border-purple-500 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Áudios Humanizados PTT</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              A IA envia áudios simulados com a voz natural do vendedor para explicar condições, tirar dúvidas e quebrar o gelo.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] hover:border-amber-500 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">CRM Kanban & Distribuição</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Organize os clientes por etapas com Drag & Drop e distribua os novos leads automaticamente entre a sua equipe de vendas.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] hover:border-emerald-500 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Atribuição de ROI Ads</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Saiba exatamente qual anúncio do Facebook, Instagram ou Google gerou o lead que fechou a compra no final do mês.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Simulador de ROI Interativo */}
      <section id="roi" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#1e2638]/60 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Calculadora de Retorno</span>
          <h2 className="text-3xl sm:text-4xl font-black">Quanto Dinheiro a sua Empresa Deixa na Mesa?</h2>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Descubra quanto você pode faturar a mais acelerando o tempo de resposta dos seus leads de anúncios.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#111622] border border-[#1e2638] shadow-2xl space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-white">
                Quantos leads chegam no seu WhatsApp por dia?
              </label>
              <span className="font-mono text-xl font-black text-[#00ddd7] bg-[#161d2d] px-4 py-1 rounded-xl border border-[#252e42]">
                {leadsPerDay} leads / dia
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={leadsPerDay}
              onChange={(e) => setLeadsPerDay(Number(e.target.value))}
              className="w-full h-2 bg-[#1c2438] rounded-lg appearance-none cursor-pointer accent-[#00ddd7]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#1e2638]">
            <div className="p-5 rounded-2xl bg-[#161d2d] border border-[#252e42] space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-mono">Vendas Extras Estimadas</span>
              <div className="text-3xl font-black text-white font-mono">+{extraSalesPerMonth} vendas / mês</div>
              <p className="text-[10px] text-gray-500">Recuperando leads que desistem pela demora no atendimento.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-400 uppercase font-mono">Faturamento Adicional Estimado</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                +R$ {extraRevenue.toLocaleString("pt-BR")},00
              </div>
              <p className="text-[10px] text-gray-400">O sistema se paga logo nos primeiros dias de uso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tabela de Planos & Preços */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1e2638]/60 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase text-[#00ddd7] tracking-wider">Planos Transparentes</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Escolha o Plano Ideal para a sua Operação
          </h2>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Sem fidelidade. Cancele ou mude de plano a qualquer momento com total liberdade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plano 1: Starter */}
          <div className="p-8 rounded-3xl bg-[#111622] border border-[#1e2638] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-400">Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 497</span>
                <span className="text-xs text-gray-400">/ mês</span>
              </div>
              <p className="text-xs text-gray-400">Ideal para corretores individuais, consultórios e lojas com 1 atendente.</p>
              
              <ul className="space-y-2.5 text-xs text-gray-300 pt-4 border-t border-[#1e2638]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Até 2.500 mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> 1 Conexão de WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> CRM Kanban Completo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Mini-Quiz de Captação
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3 rounded-xl bg-[#161d2d] hover:bg-[#1e2638] border border-[#252e42] hover:border-[#00ddd7] text-white font-bold text-xs transition text-center"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Plano 2: Pro (Destaque) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111622] to-[#0c101a] border-2 border-[#00ddd7] shadow-[0_0_40px_rgba(0,221,215,0.2)] space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00ddd7] text-black text-[10px] font-extrabold uppercase tracking-wider">
              Mais Popular
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#00ddd7]">Pro Escala</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 997</span>
                <span className="text-xs text-gray-400">/ mês</span>
              </div>
              <p className="text-xs text-gray-400">Para imobiliárias, lojas de veículos e clínicas com equipe de vendas ativa.</p>
              
              <ul className="space-y-2.5 text-xs text-gray-200 pt-4 border-t border-[#1e2638]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Até 7.500 mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> WhatsApp + Instagram Direct
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Áudios PTT Humanizados Ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Equipe & Vendedores Ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ddd7]" /> Distribuição Round-Robin Automática
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-extrabold text-xs transition text-center shadow-lg shadow-[#00ddd7]/20"
            >
              Assinar Plano Pro
            </Link>
          </div>

          {/* Plano 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-[#111622] border border-[#1e2638] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400">Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 1.997</span>
                <span className="text-xs text-gray-400">/ mês</span>
              </div>
              <p className="text-xs text-gray-400">Para grandes operações com alto tráfego pago no Meta & Google Ads.</p>
              
              <ul className="space-y-2.5 text-xs text-gray-300 pt-4 border-t border-[#1e2638]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> 15.000+ mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Meta Conversions API (CAPI) Ativa
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Visão Computacional (Análise de Fotos)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Suporte e Onboarding Dedicado
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3 rounded-xl bg-[#161d2d] hover:bg-[#1e2638] border border-[#252e42] hover:border-purple-400 text-white font-bold text-xs transition text-center"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-[#1e2638] bg-[#05070a] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] text-black flex items-center justify-center text-xs">
              Ω
            </div>
            <span>MAI — Service-as-a-Software</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} MAI Platform. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition">Acessar Painel</Link>
            <Link href="/cadastro" className="hover:text-white transition">Criar Conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
