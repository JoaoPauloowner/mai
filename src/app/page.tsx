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
  AlertTriangle,
  HelpCircle,
  Volume2,
  DollarSign,
  Layers,
  Bot,
  RefreshCw,
  Sliders,
  Share2,
  Radio,
  FileSpreadsheet,
} from "lucide-react";

export default function LandingPage() {
  const [leadsPerDay, setLeadsPerDay] = useState(40);
  const [ticketMedio, setTicketMedio] = useState(3000);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Calculo de ROI e Vazamento de Caixa (Clayton Makepeace Proof Framework)
  const leadsPorMes = leadsPerDay * 30;
  const leadsPerdidosPelaDemora = Math.round(leadsPorMes * 0.45); 
  const vendasRecuperadas = Math.max(1, Math.round(leadsPerdidosPelaDemora * 0.08));
  const faturamentoRecuperado = vendasRecuperadas * ticketMedio;
  const mensalidadePro = 997;
  const multiplicadorRoi = Math.round(faturamentoRecuperado / mensalidadePro);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handlePlayDemoAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#1A1D1A] selection:bg-[#C3F186] selection:text-[#1A1D1A] font-sans antialiased">
      
      {/* 1. Barra de Alerta Superior (Pre-Headline Makepeace Hook) */}
      <div className="bg-[#1A1D1A] text-[#F7F8F6] py-3 px-4 text-center text-xs font-medium border-b border-[#343834]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C3F186] animate-pulse" />
          <span>
            <strong>ALERTA PARA EMPRESAS QUE ANUNCIAM:</strong> 78% dos clientes compram da primeira empresa que responde no WhatsApp. Sua equipe responde em quantos minutos?
          </span>
        </div>
      </div>

      {/* 2. Header / Navbar Executiva MAI */}
      <header className="h-20 border-b border-[#E0E3DE] bg-[#F7F8F6]/90 backdrop-blur-xl sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo Oficial MAI */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1D1A] text-[#C3F186] font-extrabold text-xl flex items-center justify-center shadow-sm">
              Ω
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#1A1D1A]">
                MAI <span className="text-[#636B61] text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full bg-[#EAE2CC] border border-[#D7DBE0] ml-1">Motor de Atendimento</span>
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[#636B61]">
            <a href="#como-funciona" className="hover:text-[#1A1D1A] transition">Como Funciona</a>
            <a href="#atribuicao" className="hover:text-[#1A1D1A] transition">Funil de Atribuição</a>
            <a href="#diagnostico" className="hover:text-[#1A1D1A] transition">O Gargalo Oculto</a>
            <a href="#calculadora" className="hover:text-[#1A1D1A] transition">Calculadora de ROI</a>
            <a href="#planos" className="hover:text-[#1A1D1A] transition">Planos</a>
            <a href="#faq" className="hover:text-[#1A1D1A] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1A1D1A] border border-[#E0E3DE] bg-white hover:bg-[#EFF1EE] transition shadow-sm"
            >
              Acessar Cockpit
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 rounded-full bg-[#C3F186] hover:bg-[#B2E372] text-[#1A1D1A] text-xs font-extrabold transition shadow-sm flex items-center gap-1.5"
            >
              <span>Ativar Minha Operação</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (COPYWRITING CLAYTON MAKEPEACE + IDENTIDADE VISUAL MAI) */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAE2CC] border border-[#D7DBE0] text-xs font-bold text-[#1A1D1A]">
            <span className="w-2 h-2 rounded-full bg-[#7B8F75]" />
            <span className="uppercase tracking-wider">Inteligência Comercial & Atribuição de Tráfego Pago</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A1D1A] leading-[1.05]">
            Pare de Queimar Dinheiro em Anúncios.{" "}
            <span className="bg-[#C3F186] px-3 py-1 rounded-2xl inline-block mt-1">
              Feche Vendas no WhatsApp em 30 Segundos.
            </span>
          </h1>

          {/* Deck Copy Clayton Makepeace */}
          <p className="text-base sm:text-xl text-[#636B61] max-w-3xl mx-auto leading-relaxed font-normal">
            Enquanto a sua equipe demora 40 minutos para responder um lead frio, o seu concorrente acabou de fechar o contrato. O <strong>MAI</strong> intercepta o lead no instante exato do clique, aplica um <strong>Mini-Quiz de Triagem</strong>, responde com <strong>áudios humanizados gravados na hora (PTT)</strong> e entrega o cliente pronto para o seu vendedor fechar.
          </p>

          {/* Duplo CTA de Conversão */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-lg mx-auto">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto flex-1 min-h-[52px] px-8 rounded-full bg-[#C3F186] hover:bg-[#B2E372] text-[#1A1D1A] font-extrabold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Blindar Meu WhatsApp Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quiz/omni-demo"
              target="_blank"
              className="w-full sm:w-auto flex-1 min-h-[52px] px-8 rounded-full border border-[#E0E3DE] bg-white hover:bg-[#EFF1EE] text-[#1A1D1A] font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 text-[#1A1D1A]" />
              <span>Ver Demonstração ao Vivo</span>
            </Link>
          </div>

          {/* Badges de Confiança */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#828B80] font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7B8F75]" /> Atribuição Meta CAPI & Google Ads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7B8F75]" /> Resposta Imediata (&lt; 30 Segundos)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7B8F75]" /> Sem Contrato de Fidelidade
            </span>
          </div>
        </div>

        {/* 4. MOCKUP DO COCKPIT MAI & NOTIFICAÇÃO EM TEMPO REAL */}
        <div className="pt-6 max-w-5xl mx-auto space-y-6">
          
          {/* Card Flutuante de Notificação */}
          <div className="max-w-xl mx-auto p-4 rounded-3xl bg-white border border-[#E0E3DE] shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D1A] text-[#C3F186] flex items-center justify-center font-bold text-lg">
                Ω
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1A1D1A]">Novo Lead no WhatsApp</span>
                  <span className="text-[10px] font-mono text-[#7B8F75] bg-[#EFF1EE] px-2 py-0.5 rounded-full">Agora há pouco</span>
                </div>
                <p className="text-xs text-[#636B61] line-clamp-1">"Olá! Gostaria de agendar uma consulta sobre a proposta..."</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-[#1A1D1A] bg-[#C3F186] px-2.5 py-1 rounded-full border border-[#B2E372]">
                Score 96 (Alta Urgência)
              </span>
            </div>
          </div>

          {/* Mockup do Dashboard MAI */}
          <div className="rounded-3xl border border-[#E0E3DE] bg-[#1A1D1A] p-4 sm:p-6 shadow-2xl text-white">
            
            {/* Top Bar Cockpit */}
            <div className="flex items-center justify-between pb-5 border-b border-[#343834] text-xs font-mono text-[#A3AAA1]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#C3F186] inline-block" />
                <span className="ml-2 font-bold text-white">MAI Cockpit • Engine Comercial Ao Vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C3F186] animate-pulse" />
                <span className="text-[#C3F186] font-bold">Meta CAPI Ativa • Speed-to-Lead: 14s</span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#232723] border border-[#343834] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-[#A3AAA1]">
                  <span>LEADS QUALIFICADOS</span>
                  <span className="text-xs text-[#C3F186] font-bold">+18.4% ↑</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">180 Leads</div>
                <p className="text-[11px] text-[#A3AAA1]">Compradores com urgência e orçamento confirmado via Quiz.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#232723] border border-[#343834] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-[#A3AAA1]">
                  <span>CPL (CUSTO POR LEAD)</span>
                  <span className="text-xs text-[#C3F186] font-bold">-24.2% ↓</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#C3F186]">R$ 4,20</div>
                <p className="text-[11px] text-[#A3AAA1]">Otimização contínua enviando dados de compras fechadas de volta aos anúncios.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#232723] border border-[#343834] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-[#A3AAA1]">
                  <span>QUALIDADE DO ATENDIMENTO</span>
                  <span className="text-xs text-[#C3F186] font-bold">98.2%</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">95 / 100</div>
                <p className="text-[11px] text-[#A3AAA1]">Áudios gravados na hora e respostas instantâneas 24 horas por dia.</p>
              </div>

            </div>

            {/* Tabela de Campanhas com Atribuição em Tempo Real */}
            <div className="mt-6 p-4 rounded-2xl bg-[#111411] border border-[#343834] space-y-3">
              <div className="text-xs font-mono text-[#A3AAA1] uppercase font-bold flex justify-between">
                <span>Atribuição de Vendas por Campanha</span>
                <span className="text-[#C3F186]">Status: Operação Ativa</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#1A1D1A] border border-[#343834] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Meta Ads • Stories Fundo Funil</div>
                    <span className="text-[10px] font-mono text-[#A3AAA1]">Origem: Instagram Stories</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#C3F186]/20 text-[#C3F186] font-mono font-bold text-[10px]">
                    R$ 28.500 fechados
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D1A] border border-[#343834] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Google Ads • Termos de Compra</div>
                    <span className="text-[10px] font-mono text-[#A3AAA1]">Origem: Google Search</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#C3F186]/20 text-[#C3F186] font-mono font-bold text-[10px]">
                    R$ 14.200 fechados
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D1A] border border-[#343834] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">WhatsApp Direto / Orgânico</div>
                    <span className="text-[10px] font-mono text-[#A3AAA1]">Origem: Bio do Instagram</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono text-[10px]">
                    R$ 6.800 fechados
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 5. COMO FUNCIONA O FUNIL MAI (4 ETAPAS HORIZONTAIS) */}
      <section id="atribuicao" className="py-20 px-6 bg-[#EFF1EE] border-t border-[#E0E3DE]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-mono uppercase text-[#7B8F75] tracking-wider font-extrabold">
              Arquitetura Comercial • O Funil MAI
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1D1A]">
              Do Clique no Anúncio ao Dinheiro no Caixa
            </h2>
            <p className="text-base text-[#636B61] leading-relaxed">
              Veja como o MAI transforma cada real investido em campanhas em reuniões agendadas e contratos assinados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E0E3DE] space-y-3 shadow-sm relative">
              <div className="w-10 h-10 rounded-2xl bg-[#EAE2CC] text-[#1A1D1A] font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#1A1D1A]">1. Clique no Anúncio</h3>
              <p className="text-xs text-[#636B61] leading-relaxed">
                O lead clica no seu anúncio do Facebook, Instagram ou Google. O MAI captura automaticamente os parâmetros UTMs e a intenção de compra.
              </p>
              <div className="text-[10px] font-mono text-[#7B8F75] bg-[#F7F8F6] p-2 rounded-lg border border-[#E0E3DE]">
                ✓ Captura transparente sem perda
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E0E3DE] space-y-3 shadow-sm relative">
              <div className="w-10 h-10 rounded-2xl bg-[#C3F186] text-[#1A1D1A] font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#1A1D1A]">2. Mini-Quiz & Score</h3>
              <p className="text-xs text-[#636B61] leading-relaxed">
                O lead responde um quiz dinâmico de 3 perguntas. A IA identifica na hora o orçamento, urgência e interesse, gerando um Lead Score de 0 a 100.
              </p>
              <div className="text-[10px] font-mono text-[#7B8F75] bg-[#F7F8F6] p-2 rounded-lg border border-[#E0E3DE]">
                ✓ Elimina 100% dos curiosos
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E0E3DE] space-y-3 shadow-sm relative">
              <div className="w-10 h-10 rounded-2xl bg-[#1A1D1A] text-white font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#1A1D1A]">3. Áudio Humanizado (PTT)</h3>
              <p className="text-xs text-[#636B61] leading-relaxed">
                Em menos de 20 segundos, a IA gera e envia um áudio simulado com voz humana personalizada com base no que o cliente respondeu.
              </p>
              <div className="text-[10px] font-mono text-[#7B8F75] bg-[#F7F8F6] p-2 rounded-lg border border-[#E0E3DE]">
                ✓ Mais de 85% de taxa de escuta
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E0E3DE] space-y-3 shadow-sm relative">
              <div className="w-10 h-10 rounded-2xl bg-[#7B8F75] text-white font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-[#1A1D1A]">4. Atribuição & Fechamento</h3>
              <p className="text-xs text-[#636B61] leading-relaxed">
                O vendedor recebe o comprador pronto na roleta do CRM e a venda fechada é devolvida ao Meta/Google Ads via CAPI para baratear os anúncios.
              </p>
              <div className="text-[10px] font-mono text-[#7B8F75] bg-[#F7F8F6] p-2 rounded-lg border border-[#E0E3DE]">
                ✓ Barateia o custo por lead
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. A ANATOMIA DO SANGRAMENTO (DIAGNÓSTICO BRUTAL DE MERCADO) */}
      <section id="diagnostico" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-red-600 tracking-wider font-extrabold">
            Diagnóstico Comercial • O Custo Oculto
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1D1A]">
            Onde o Seu Dinheiro de Anúncios Está Sendo Queimado?
          </h2>
          <p className="text-base text-[#636B61]">
            Não é o criativo do anúncio. É o que acontece nos primeiros 5 minutos após o clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl border border-red-200 bg-red-50/40 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1D1A]">1. A Morte pela Demora (&gt; 15 min)</h3>
            <p className="text-sm text-[#636B61] leading-relaxed">
              O cliente clica querendo comprar agora. Se a sua equipe demora 30 minutos, o interesse cai em 80% e ele fecha com o concorrente que respondeu primeiro.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-red-200 bg-red-50/40 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1D1A]">2. Vendedores Esgotados com Curiosos</h3>
            <p className="text-sm text-[#636B61] leading-relaxed">
              Sua equipe perde o dia inteiro conversando com leads desqualificados sem orçamento, e não sobra tempo para atender com atenção os compradores de alto valor.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-red-200 bg-red-50/40 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1D1A]">3. Cegueira Total de ROI de Anúncios</h3>
            <p className="text-sm text-[#636B61] leading-relaxed">
              O gestor de tráfego mostra relatórios cheios de cliques e mensagens iniciadas, mas você não sabe qual campanha colocou dinheiro de verdade no seu saldo bancário.
            </p>
          </div>

        </div>
      </section>

      {/* 7. CALCULADORA DE RETORNO / ROI INTERATIVA */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#7B8F75] tracking-wider font-extrabold">
            Simulação Financeira • Retorno de Caixa Real
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1D1A]">
            Quanto Faturamento o MAI Recupera Para a Sua Empresa?
          </h2>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl border border-[#E0E3DE] bg-white shadow-xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1A1D1A]">
                  Leads de Anúncios por Dia
                </label>
                <span className="font-mono text-lg font-bold text-[#1A1D1A] bg-[#EFF1EE] px-3 py-1 rounded-xl border border-[#E0E3DE]">
                  {leadsPerDay} leads / dia
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={leadsPerDay}
                onChange={(e) => setLeadsPerDay(Number(e.target.value))}
                className="w-full h-2.5 bg-[#EFF1EE] rounded-lg appearance-none cursor-pointer accent-[#1A1D1A]"
              />
              <span className="text-[11px] text-[#828B80] block">Volume total de {leadsPorMes} pessoas chamando por mês.</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1A1D1A]">
                  Ticket Médio da Venda / Contrato
                </label>
                <span className="font-mono text-lg font-bold text-[#1A1D1A] bg-[#C3F186] px-3 py-1 rounded-xl border border-[#B2E372]">
                  R$ {ticketMedio.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={20000}
                step={500}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full h-2.5 bg-[#EFF1EE] rounded-lg appearance-none cursor-pointer accent-[#7B8F75]"
              />
              <span className="text-[11px] text-[#828B80] block">Receita média por cliente fechado.</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E0E3DE] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-[#EFF1EE] border border-[#E0E3DE] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#636B61] font-bold">Leads Perdidos Pela Demora</span>
              <div className="text-3xl font-extrabold font-mono text-red-600">~{leadsPerdidosPelaDemora}</div>
              <p className="text-[11px] text-[#828B80]">Contatos que esfriaram esperando resposta.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EFF1EE] border border-[#E0E3DE] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#636B61] font-bold">Vendas Extras Fechadas (MAI)</span>
              <div className="text-3xl font-extrabold font-mono text-[#1A1D1A]">+{vendasRecuperadas} vendas</div>
              <p className="text-[11px] text-[#828B80]">Recuperação com resposta em &lt; 30 segundos.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#C3F186] text-[#1A1D1A] space-y-1 shadow-md">
              <span className="text-[11px] font-mono uppercase text-[#1A1D1A] font-extrabold">Caixa Extra Todo Mês</span>
              <div className="text-3xl font-extrabold font-mono">
                +R$ {faturamentoRecuperado.toLocaleString("pt-BR")}
              </div>
              <p className="text-[11px] text-[#1A1D1A] font-medium">Retorno estimado de {multiplicadorRoi}x o valor do plano Pro.</p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1A1D1A] hover:bg-[#2A2F2A] text-white font-bold text-sm shadow-lg transition"
            >
              <span>Recuperar Esse Faturamento Agora</span>
              <ArrowRight className="w-4 h-4 text-[#C3F186]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. TABELA DE PLANOS DE LICENCIAMENTO MAI */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E0E3DE] space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#7B8F75] tracking-wider font-extrabold">
            Planos Comerciais • Sem Fidelidade
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1D1A]">
            Escolha o Plano Ideal Para a Sua Operação
          </h2>
          <p className="text-sm text-[#636B61]">
            Comece hoje sem contratos de fidelidade. Cancele quando quiser com 1 clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Starter */}
          <div className="p-8 rounded-3xl border border-[#E0E3DE] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#636B61] font-bold">Plano Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#1A1D1A]">R$ 497</span>
                <span className="text-xs text-[#636B61]">/ mês</span>
              </div>
              <p className="text-xs text-[#636B61]">Para corretores individuais, profissionais liberais e pequenas empresas.</p>
              
              <ul className="space-y-3 text-xs text-[#1A1D1A] pt-4 border-t border-[#EFF1EE]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span><strong>Até 2.500 mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span><strong>1 Conexão de WhatsApp</strong> (QR Code Nativo)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span>Pipeline CRM Kanban Completo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span>1 Mini-Quiz de Captação & Triagem</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3.5 rounded-full border border-[#E0E3DE] bg-[#EFF1EE] hover:bg-white text-[#1A1D1A] font-bold text-xs transition text-center"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Pro Escala (DESTAQUE LIME) */}
          <div className="p-8 rounded-3xl border-2 border-[#1A1D1A] bg-white space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C3F186] text-[#1A1D1A] text-[11px] font-extrabold uppercase tracking-wider shadow-sm border border-[#B2E372]">
              Mais Escolhido por Empresas
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#1A1D1A] font-extrabold">Plano Pro Escala</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#1A1D1A]">R$ 997</span>
                <span className="text-xs text-[#636B61]">/ mês</span>
              </div>
              <p className="text-xs text-[#636B61]">Para imobiliárias, lojas de veículos, clínicas e empresas com equipe comercial.</p>
              
              <ul className="space-y-3 text-xs text-[#1A1D1A] pt-4 border-t border-[#EFF1EE]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#1A1D1A] flex-shrink-0" />
                  <span><strong>Até 8.000 mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#1A1D1A] flex-shrink-0" />
                  <span><strong>WhatsApp + Instagram Direct</strong> unificados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#1A1D1A] flex-shrink-0" />
                  <span><strong>Áudios Humanizados Gravados (PTT)</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#1A1D1A] flex-shrink-0" />
                  <span><strong>Equipe & Vendedores Ilimitados</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#1A1D1A] flex-shrink-0" />
                  <span><strong>Distribuição Round-Robin Automática</strong></span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-4 rounded-full bg-[#C3F186] hover:bg-[#B2E372] text-[#1A1D1A] font-extrabold text-xs transition text-center shadow-md"
            >
              Ativar Plano Pro Escala
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl border border-[#E0E3DE] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#7B8F75] font-bold">Plano Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#1A1D1A]">R$ 1.997</span>
                <span className="text-xs text-[#636B61]">/ mês</span>
              </div>
              <p className="text-xs text-[#636B61]">Para grandes anunciantes, concessionárias e indústrias com alto tráfego.</p>
              
              <ul className="space-y-3 text-xs text-[#1A1D1A] pt-4 border-t border-[#EFF1EE]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span><strong>20.000+ mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span><strong>Meta CAPI Reversa Nativa</strong> (Atribuição Total)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span><strong>Visão Computacional</strong> (Fotos & Docs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7B8F75] flex-shrink-0" />
                  <span>Gerente de Contas & Suporte VIP</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3.5 rounded-full border border-[#E0E3DE] bg-[#EFF1EE] hover:bg-white text-[#1A1D1A] font-bold text-xs transition text-center"
            >
              Falar com Especialista
            </Link>
          </div>

        </div>

      </section>

      {/* 9. FAQ DE QUEBRA DE OBJEÇÕES */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#7B8F75] tracking-wider font-extrabold">Dúvidas Frequentes</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D1A]">
            Perguntas & Respostas Rápidas
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "O que é o MAI e como ele ajuda a minha empresa?",
              a: "O MAI é uma plataforma de inteligência comercial e atendimento imediato que conecta seus anúncios do Meta/Google ao WhatsApp. Ele qualifica o lead com um mini-quiz rápido de 3 perguntas e envia áudios humanizados gravados na hora em menos de 30 segundos, entregando o cliente pronto para o seu vendedor fechar."
            },
            {
              q: "Preciso de um número novo de WhatsApp?",
              a: "Não. Você conecta o número que a sua empresa já utiliza hoje lendo um QR Code em menos de 1 minuto, sem perder o histórico das suas conversas."
            },
            {
              q: "Como o MAI reduz o custo por lead (CPL)?",
              a: "Através da API de Conversões (Meta CAPI), o MAI envia os dados das vendas fechadas de volta para o algoritmo do Facebook/Google, ensinando o algoritmo a buscar apenas pessoas com perfil de compradores reais."
            },
            {
              q: "Existe contrato de fidelidade?",
              a: "Nenhum. Nossos planos são mensais sem qualquer fidelidade ou taxa de cancelamento. Você pode cancelar com 1 clique direto no painel."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-[#E0E3DE] rounded-2xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-sm text-[#1A1D1A] hover:bg-[#EFF1EE] transition"
              >
                <span>{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-[#636B61] transition-transform ${activeFaq === idx ? "rotate-90" : ""}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-xs text-[#636B61] leading-relaxed border-t border-[#EFF1EE] pt-4 bg-[#F7F8F6]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. RODAPÉ INSTITUCIONAL MAI */}
      <footer className="border-t border-[#E0E3DE] bg-[#1A1D1A] text-[#A3AAA1] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-2xl bg-[#C3F186] text-[#1A1D1A] flex items-center justify-center font-extrabold">
                Ω
              </div>
              <span>MAI — Motor de Atendimento & Inteligência</span>
            </div>
            <p className="text-[#A3AAA1] max-w-sm leading-relaxed">
              Infraestrutura de alta performance para qualificação de leads de tráfego pago e fechamento de vendas no WhatsApp com inteligência artificial e áudios humanizados.
            </p>
            <div className="text-[11px] text-[#636B61]">
              &copy; {new Date().getFullYear()} MAI Platform. Todos os direitos reservados.
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Recursos</span>
            <ul className="space-y-2">
              <li><a href="#como-funciona" className="hover:text-white transition">Como Funciona</a></li>
              <li><a href="#atribuicao" className="hover:text-white transition">Funil de Atribuição</a></li>
              <li><a href="#calculadora" className="hover:text-white transition">Calculadora de ROI</a></li>
              <li><a href="#planos" className="hover:text-white transition">Planos e Preços</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Acesso Direto</span>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white transition">Login no Cockpit</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition">Ativar Operação</Link></li>
              <li><Link href="/quiz/omni-demo" target="_blank" className="hover:text-[#C3F186] transition">Demonstração Interativa</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
