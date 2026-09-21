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
  Check,
  X,
  Building2,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [leadsPerDay, setLeadsPerDay] = useState(30);

  // Calculo de ROI Estimado baseado no valor que o cliente deixa na mesa
  const extraSalesPerMonth = Math.round(leadsPerDay * 30 * 0.05); // 5% de conversao extra pela velocidade < 30s
  const avgTicket = 2000;
  const extraRevenue = extraSalesPerMonth * avgTicket;

  return (
    <div className="min-h-screen bg-white text-[#0B0D12] selection:bg-[#0A1F3B] selection:text-white font-sans">
      {/* 1. Barra de Alerta Superior (Clayton Makepeace Hook) */}
      <div className="bg-[#0A1F3B] text-white py-2.5 px-4 text-center text-xs font-medium border-b border-[#13325B]">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00DDD7] animate-pulse" />
          <span><strong>Alerta para Empresários:</strong> 78% dos clientes compram da primeira empresa que responde no WhatsApp. Sua equipe responde em quanto tempo?</span>
        </span>
      </div>

      {/* 2. Header / Navbar Executiva */}
      <header className="h-20 border-b border-[#D7DBE0]/60 bg-white/90 backdrop-blur-xl sticky top-0 z-50 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A1F3B] text-white font-bold text-xl flex items-center justify-center shadow-md">
            Ω
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0B0D12]">
              MAI <span className="text-[#0A1F3B] text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 border border-gray-200 ml-1">B2B Platform</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#5F6673]">
          <a href="#diagnostico" className="hover:text-[#0A1F3B] transition">O Gargalo Invisível</a>
          <a href="#solucoes" className="hover:text-[#0A1F3B] transition">Como o MAI Vende</a>
          <a href="#roi" className="hover:text-[#0A1F3B] transition">Calculadora de Caixa</a>
          <a href="#planos" className="hover:text-[#0A1F3B] transition">Planos & Licenciamento</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#344054] hover:text-[#0A1F3B] hover:bg-gray-100 transition"
          >
            Acessar Painel
          </Link>
          <Link
            href="/cadastro"
            className="px-6 py-2.5 rounded-lg bg-[#0A1F3B] hover:bg-[#13325B] text-white text-xs font-semibold transition shadow-md flex items-center gap-1.5"
          >
            <span>Iniciar Operação</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 3. Hero Section (Copywriting Clayton Makepeace) */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-mono text-[#344054]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-wider">Implementação Comercial de IA para Empresas</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B0D12] leading-[1.08] max-w-5xl mx-auto">
          Pare de Queimar Dinheiro em Anúncios.{" "}
          <span className="text-[#344054]">Feche Vendas no WhatsApp em 30 Segundos.</span>
        </h1>

        <p className="text-base sm:text-xl text-[#5F6673] max-w-3xl mx-auto leading-relaxed font-normal">
          Enquanto a sua equipe demora 40 minutos para responder um lead frio, o seu concorrente acabou de fechar o contrato. O <strong>MAI</strong> intercepta os cliques do Meta e Google Ads, qualifica a urgência com Mini-Quizzes e responde com <strong>áudios humanizados gravados na hora</strong>.
        </p>

        {/* Duplo Ataque de Decisão (Makepeace Framework) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto flex-1 min-h-[52px] px-8 rounded-lg bg-[#0A1F3B] hover:bg-[#13325B] text-white font-semibold text-sm transition shadow-xl flex items-center justify-center gap-2"
          >
            <span>Blindar Meu WhatsApp Agora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/quiz/omni-demo"
            target="_blank"
            className="w-full sm:w-auto flex-1 min-h-[52px] px-8 rounded-lg border border-[#D7DBE0] bg-white hover:bg-gray-50 text-[#0B0D12] font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 text-[#0A1F3B]" />
            <span>Ver em Ação ao Vivo</span>
          </Link>
        </div>

        {/* Barra de Provas Imediatas */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-semibold text-[#5F6673]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Resposta Imediata (&lt; 30 Segundos)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0A1F3B]" />
            <span>Atribuição Exata de ROI (Meta/Google Ads)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Áudios Humanizados com Voz Natural (PTT)</span>
          </div>
        </div>

        {/* Mockup Central de Alta Autoridade (Design Geist) */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#D7DBE0] bg-[#0A1F3B] p-3 shadow-[0_25px_60px_rgba(10,31,59,0.18)]">
            <div className="rounded-xl bg-[#0B0D12] text-white overflow-hidden border border-[#1e2638]">
              {/* Top bar */}
              <div className="h-10 bg-[#07090e] border-b border-[#1e2638] px-4 flex items-center justify-between text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span>MAI Enterprise Cockpit • Live System</span>
                <span className="text-emerald-400">● 98.4% de Eficiência Comercial</span>
              </div>

              {/* Grid Interno do Dashboard */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638] space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                    <span>TRIAGEM DE LEAD IA</span>
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold font-mono text-emerald-400">Score 95/100</div>
                  <p className="text-xs text-gray-300">Cliente preencheu Quiz com urgência imediata e orçamento aprovado.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638] space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                    <span>ÁUDIO HUMANIZADO (PTT)</span>
                    <MessageSquare className="w-4 h-4 text-[#00DDD7]" />
                  </div>
                  <div className="text-xs bg-[#0c101a] p-2.5 rounded-lg border border-[#1e2638] text-gray-200">
                    🎙️ <em>"Olá Roberto! Separei aqui a proposta que você solicitou no anúncio..."</em>
                  </div>
                  <span className="text-[10px] font-mono text-[#00DDD7] block">Disparado em 12 segundos</span>
                </div>

                <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638] space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                    <span>ATRIBUIÇÃO DE CAMPANHA</span>
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white">meta_stories_fundo_funil</div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                    Contrato Fechado: R$ 15.000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O Diagnóstico Brutal (Por Que as Empresas Perdem Vendas) */}
      <section id="diagnostico" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#D7DBE0]/60 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-semibold">O Custo Oculto da Ineficiência</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0D12]">
            Onde o Seu Dinheiro de Anúncios Está Vazando
          </h2>
          <p className="text-sm text-[#5F6673] max-w-2xl mx-auto">
            Não é o seu anúncio que é ruim. É o que acontece nos primeiros 5 minutos após o clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <X className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">A Morte pelo Tempo de Resposta</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              O lead clica no anúncio querendo comprar agora. Se o atendente demora 20 minutos, o interesse cai em 80% e o lead chama o próximo anunciante.
            </p>
          </div>

          <div className="p-7 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <X className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">Vendedores Perdendo Tempo com Curiosos</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              Sua equipe gasta 7 horas por dia conversando com pessoas sem orçamento ou sem pressa, deixando os compradores de alto ticket esperando na fila.
            </p>
          </div>

          <div className="p-7 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <X className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">Cegueira Total de Métricas (Sem ROI)</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              O gestor de tráfego diz que o anúncio "gerou muitos cliques", mas você não sabe qual campanha colocou dinheiro de verdade na sua conta bancária.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Como o MAI Resolve (Os 4 Pilares da Máquina) */}
      <section id="solucoes" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#D7DBE0]/60 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-semibold">A Engenharia de Fechamento</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0D12]">
            Uma Operação Comercial Blindada de Ponta a Ponta
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-[#D7DBE0] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">1. Mini-Quiz de Qualificação</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              Filtra renda, urgência e necessidade em 30 segundos antes do lead falar com qualquer pessoa.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D7DBE0] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">2. Áudios Humanizados (PTT)</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              A IA envia áudios naturais simulados para gerar proximidade, quebrar objeções e marcar reuniões.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D7DBE0] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">3. CRM Kanban & Distribuição</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              Distribui os compradores qualificados automaticamente entre os seus vendedores em fila circular.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D7DBE0] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0B0D12]">4. Atribuição Reversa (CAPI)</h3>
            <p className="text-xs text-[#5F6673] leading-relaxed">
              Devolve as vendas fechadas para o algoritmo do Facebook/Google para baratear o custo por lead.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Calculadora de Retorno / ROI Interativa */}
      <section id="roi" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#D7DBE0]/60 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-emerald-700 tracking-wider font-semibold">Simulação de Impacto Financeiro</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B0D12]">O Retorno Real no Caixa da Sua Empresa</h2>
        </div>

        <div className="p-8 rounded-2xl border border-[#D7DBE0] bg-gray-50 shadow-xl space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-[#0B0D12]">
                Quantos leads chegam no seu WhatsApp por dia através de anúncios?
              </label>
              <span className="font-mono text-xl font-bold text-[#0A1F3B] bg-white px-4 py-1 rounded-lg border border-[#D7DBE0]">
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A1F3B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-1">
              <span className="text-xs text-gray-500 uppercase font-mono">Vendas Extras Recuperadas</span>
              <div className="text-3xl font-bold text-[#0B0D12] font-mono">+{extraSalesPerMonth} vendas / mês</div>
              <p className="text-xs text-gray-400">Clientes que comprariam do concorrente pela demora no primeiro contato.</p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
              <span className="text-xs text-emerald-800 uppercase font-mono font-semibold">Faturamento Adicional Estimado</span>
              <div className="text-3xl font-bold text-emerald-700 font-mono">
                +R$ {extraRevenue.toLocaleString("pt-BR")},00
              </div>
              <p className="text-xs text-emerald-800">A mensalidade do MAI representa menos de 5% do lucro que ele devolve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Tabela de Planos de Licenciamento */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#D7DBE0]/60 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-semibold">Investimento Transparente</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0D12]">
            Planos sem Contrato de Fidelidade
          </h2>
          <p className="text-sm text-[#5F6673] max-w-xl mx-auto">
            Mude de plano ou cancele a qualquer momento com apenas 1 clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="p-8 rounded-2xl border border-[#D7DBE0] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold">Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0B0D12]">R$ 497</span>
                <span className="text-xs text-gray-500">/ mês</span>
              </div>
              <p className="text-xs text-gray-500">Para corretores individuais, consultórios e pequenas lojas com 1 atendente.</p>
              
              <ul className="space-y-2.5 text-xs text-[#344054] pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Até 2.500 mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> 1 Conexão de WhatsApp (QR Code)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Pipeline CRM Kanban Completo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Mini-Quiz de Captação Público
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3 rounded-lg border border-[#D7DBE0] bg-gray-50 hover:bg-gray-100 text-[#0B0D12] font-semibold text-xs transition text-center"
            >
              Iniciar com Starter
            </Link>
          </div>

          {/* Pro (Destaque Institucional) */}
          <div className="p-8 rounded-2xl border-2 border-[#0A1F3B] bg-white space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#0A1F3B] text-white text-[10px] font-bold uppercase tracking-wider">
              Mais Escolhido por Empresas
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#0A1F3B] font-bold">Pro Escala</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0B0D12]">R$ 997</span>
                <span className="text-xs text-gray-500">/ mês</span>
              </div>
              <p className="text-xs text-gray-500">Para imobiliárias, lojas de seminovos e clínicas com equipe de vendas.</p>
              
              <ul className="space-y-2.5 text-xs text-[#344054] pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0A1F3B]" /> Até 7.500 mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0A1F3B]" /> WhatsApp + Instagram Direct
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0A1F3B]" /> Áudios Humanizados PTT Ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0A1F3B]" /> Equipe & Vendedores Ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0A1F3B]" /> Distribuição Automática Round-Robin
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3 rounded-lg bg-[#0A1F3B] hover:bg-[#13325B] text-white font-semibold text-xs transition text-center shadow-lg"
            >
              Assinar Plano Pro
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-2xl border border-[#D7DBE0] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-700 font-semibold">Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0B0D12]">R$ 1.997</span>
                <span className="text-xs text-gray-500">/ mês</span>
              </div>
              <p className="text-xs text-gray-500">Para grandes operações com alto volume de investimento em tráfego pago.</p>
              
              <ul className="space-y-2.5 text-xs text-[#344054] pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" /> 15.000+ mensagens de IA / mês
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" /> Meta Conversions API (CAPI) Ativa
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" /> Visão Computacional (Fotos & Docs)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" /> Onboarding & Suporte VIP
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3 rounded-lg border border-[#D7DBE0] bg-gray-50 hover:bg-gray-100 text-[#0B0D12] font-semibold text-xs transition text-center"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Rodapé Institucional B2B */}
      <footer className="border-t border-[#D7DBE0] bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#5F6673]">
          <div className="flex items-center gap-2 text-[#0B0D12] font-bold">
            <div className="w-6 h-6 rounded-lg bg-[#0A1F3B] text-white flex items-center justify-center text-xs">
              Ω
            </div>
            <span>MAI — Motor de Atendimento & Inteligência</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} MAI Platform. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-[#0A1F3B] transition">Acessar Cockpit</Link>
            <Link href="/cadastro" className="hover:text-[#0A1F3B] transition">Criar Conta Comercial</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
