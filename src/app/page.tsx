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
  const [leadsPerDay, setLeadsPerDay] = useState(35);
  const [ticketMedio, setTicketMedio] = useState(2500);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Calculo de ROI e Vazamento de Caixa Incontestavel (Clayton Makepeace Proof Framework)
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
    <div className="min-h-screen bg-white text-[#0B0D12] selection:bg-[#00F0FF] selection:text-[#07090E] font-sans antialiased">
      
      {/* 1. Barra de Alerta Superior (Pre-Headline Makepeace Hook) */}
      <div className="bg-[#07090E] text-white py-3 px-4 text-center text-xs font-medium border-b border-[#1E2638]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <span>
            <strong>ALERTA DE CAIXA:</strong> 78% dos clientes compram da primeira empresa que responde no WhatsApp. Em quantos minutos sua equipe responde hoje?
          </span>
        </div>
      </div>

      {/* 2. Header / Navbar Executiva MAI */}
      <header className="h-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo Oficial MAI */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#07090E] text-[#00F0FF] font-extrabold text-xl flex items-center justify-center shadow-md border border-[#1E2638]">
              Ω
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0B0D12]">
                MAI <span className="text-[#07090E] text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200 ml-1">Motor de Atendimento</span>
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#475569]">
            <a href="#como-funciona" className="hover:text-[#07090E] transition">Como Funciona</a>
            <a href="#diagnostico" className="hover:text-[#07090E] transition">O Gargalo Oculto</a>
            <a href="#comparativo" className="hover:text-[#07090E] transition">Comparativo</a>
            <a href="#calculadora" className="hover:text-[#07090E] transition">Calculadora de Caixa</a>
            <a href="#planos" className="hover:text-[#07090E] transition">Planos</a>
            <a href="#faq" className="hover:text-[#07090E] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#334155] hover:text-[#07090E] hover:bg-slate-50 transition"
            >
              Acessar Cockpit
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 rounded-lg bg-[#07090E] hover:bg-[#161D2D] text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 border border-[#1E2638]"
            >
              <span className="text-[#00F0FF]">Ativar Operação</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (CLAYTON MAKEPEACE DENSE SALES COPY) */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-5 max-w-5xl mx-auto">
          
          {/* Eyebrow / Pre-Headline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-[#07090E]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="uppercase tracking-wider">A Solução Definitiva Para o Vício de Queimar Dinheiro em Tráfego Pago</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B0D12] leading-[1.06]">
            Enquanto Sua Equipe Demora 30 Minutos Para Responder,{" "}
            <span className="text-[#07090E] underline decoration-[#00F0FF] decoration-wavy decoration-2">
              Seu Concorrente Já Fechou a Venda.
            </span>
          </h1>

          {/* Deck Copy Clayton Makepeace */}
          <p className="text-base sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed font-normal">
            Não adianta colocar mais R$ 5.000 no Meta ou Google Ads se o seu cliente qualificado espera 40 minutos por uma mensagem no WhatsApp. O <strong>MAI</strong> intercepta o lead no instante exato do clique, aplica um <strong>Mini-Quiz de Triagem</strong>, responde com <strong>Áudios Gravados na Hora (PTT)</strong> com voz humana e entrega o cliente pronto no colo do seu melhor vendedor.
          </p>

          {/* Duplo CTA de Conversão Imediata */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto flex-1 min-h-[54px] px-8 rounded-xl bg-[#07090E] hover:bg-[#161D2D] text-white font-bold text-sm transition shadow-xl flex items-center justify-center gap-2 border border-[#1E2638]"
            >
              <span>Blindar Meu WhatsApp em 30s</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
            </Link>

            <Link
              href="/quiz/omni-demo"
              target="_blank"
              className="w-full sm:w-auto flex-1 min-h-[54px] px-8 rounded-xl border-2 border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0B0D12] font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 text-[#07090E]" />
              <span>Testar a IA no Meu Celular</span>
            </Link>
          </div>

          {/* Micro-Garantia */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sem fidelidade contratual
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#00DDD7]" /> Ativação em menos de 10 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-600" /> WhatsApp Oficial ou QR Code
            </span>
          </div>
        </div>

        {/* 4. MOCKUP DO COCKPIT MAI AO VIVO (DESIGN OBSIDIAN & CYAN) */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#CBD5E1] bg-[#07090E] p-3 sm:p-4 shadow-[0_30px_70px_rgba(7,9,14,0.25)]">
            <div className="rounded-xl bg-[#0B0D12] text-white overflow-hidden border border-[#1E2638]">
              
              {/* Header do Cockpit */}
              <div className="h-11 bg-[#05060A] border-b border-[#1E2638] px-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-300 font-semibold hidden sm:inline">MAI Cockpit • Speed-to-Lead Live Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                  <span className="text-[#00F0FF] font-semibold text-[11px]">Tempo de Resposta: 14 Segundos</span>
                </div>
              </div>

              {/* Grid Interno do Dashboard com Prova Lógica */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                
                {/* Card 1: Triagem com Score */}
                <div className="p-4 rounded-xl bg-[#0F141F] border border-[#1E2638] space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>1. TRIAGEM DE URGÊNCIA</span>
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-emerald-400">Score 98/100</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">ALTO TICKET</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lead concluiu o Mini-Quiz: Orçamento aprovado e decisão de compra para esta semana.
                  </p>
                </div>

                {/* Card 2: Áudio Humanizado PTT */}
                <div className="p-4 rounded-xl bg-[#0F141F] border border-[#1E2638] space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>2. ÁUDIO HUMANIZADO (PTT)</span>
                    <Volume2 className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  
                  {/* Player Simulado */}
                  <div className="p-2.5 rounded-lg bg-[#07090E] border border-[#1E2638] flex items-center gap-3">
                    <button
                      onClick={handlePlayDemoAudio}
                      className="w-8 h-8 rounded-full bg-[#00F0FF] text-[#07090E] flex items-center justify-center font-bold text-xs hover:scale-105 transition shadow-sm"
                    >
                      {isPlayingAudio ? "⏸" : "▶"}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#00F0FF] ${isPlayingAudio ? "w-full transition-all duration-[4000ms]" : "w-1/3"}`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>0:14</span>
                        <span>{isPlayingAudio ? "Tocando áudio real..." : "Simular Voz Humana"}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 block">
                    💬 "Olá Carlos! Vi que você selecionou a proposta no anúncio. Separei aqui uma condição especial..."
                  </span>
                </div>

                {/* Card 3: Atribuição de Dinheiro Real (CAPI) */}
                <div className="p-4 rounded-xl bg-[#0F141F] border border-[#1E2638] space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>3. RETORNO DE CAIXA REAL</span>
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white">Campanha: [Meta_Stories_Fundo_Funil]</div>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <span className="text-xs text-emerald-300 font-mono">Contrato Fechado:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">R$ 28.500,00</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Venda atribuída com sucesso via Meta CAPI para baratear o custo dos próximos anúncios.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A ANATOMIA DO SANGRAMENTO (DIAGNÓSTICO BRUTAL DE MERCADO) */}
      <section id="diagnostico" className="py-20 px-6 bg-slate-50 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-mono uppercase text-red-600 tracking-wider font-bold">
              Diagnóstico Comercial • A Dor Invisível
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
              Por Que 7 em Cada 10 Reais Que Você Gasta em Anúncios Vão Direto Para o Lixo?
            </h2>
            <p className="text-base text-[#475569] leading-relaxed">
              A maioria dos empresários acredita que o problema está no criativo do anúncio ou no público do Facebook. <strong>A verdade é muito mais dura e matemática:</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Gargalo 1 */}
            <div className="p-8 rounded-2xl border border-red-200 bg-white shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B0D12]">1. A Morte Pela "Janela dos 5 Minutos"</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Estudos da Harvard Business Review provam: um lead que não recebe resposta em até 5 minutos tem <strong>400% menos chances de qualificação</strong>. Se seu atendente demora 45 minutos (porque estava no almoço ou no banheiro), aquele cliente já chamou outro anunciante.
              </p>
              <div className="p-3 bg-red-50 rounded-lg text-xs font-mono text-red-700 font-semibold">
                📉 Perda estimada: 60% dos clientes quentes
              </div>
            </div>

            {/* Gargalo 2 */}
            <div className="p-8 rounded-2xl border border-red-200 bg-white shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B0D12]">2. Vendedores Gastos com Curiosos</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Sua equipe passa 6 horas do dia digitando "Olá, qual seu modelo de interesse?" para pessoas sem dinheiro ou que clicaram por engano. No fim da tarde, quando um lead com R$ 50.000 para fechar entra, o vendedor está exausto e atende com má vontade.
              </p>
              <div className="p-3 bg-red-50 rounded-lg text-xs font-mono text-red-700 font-semibold">
                📉 80% do tempo gasto com zero retorno
              </div>
            </div>

            {/* Gargalo 3 */}
            <div className="p-8 rounded-2xl border border-red-200 bg-white shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B0D12]">3. O Mito do "Chatbot Tradicional"</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Você tenta colocar um chatbot de árvore genérico: <em>"Digite 1 para Vendas, Digite 2 para Suporte"</em>. O cliente moderno odeia falar com robôs e abandona a conversa na primeira pergunta sem responder. Você perde a venda e ainda queima a reputação da marca.
              </p>
              <div className="p-3 bg-red-50 rounded-lg text-xs font-mono text-red-700 font-semibold">
                📉 65% de abandono imediato da conversa
              </div>
            </div>

          </div>

          {/* Callout Box Clayton Makepeace */}
          <div className="p-8 rounded-2xl bg-[#07090E] text-white space-y-4 max-w-4xl mx-auto shadow-xl border border-[#1E2638]">
            <div className="flex items-center gap-3 text-[#00F0FF] font-mono text-xs uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>A Lei Imutável das Vendas Digitais</span>
            </div>
            <h3 className="text-2xl font-bold leading-snug">
              "Você não tem um problema de tráfego. Você tem um buraco negro entre o clique no anúncio e a primeira palavra dita no WhatsApp."
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              O consumidor de hoje não tem paciência. Se você responde em 20 segundos com atenção de especialista e voz humanizada, você vence a concorrência antes mesmo dela abrir o WhatsApp.
            </p>
          </div>

        </div>
      </section>

      {/* 6. COMO O MAI RESOLVE (THE 4-STROKE ENGINE) */}
      <section id="como-funciona" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#07090E] tracking-wider font-bold">
            O Mecanismo Único • A Engenharia dos 4 Cilindros
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Como o MAI Transforma Cliques Frios em Vendas Fechadas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#07090E] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#07090E] text-[#00F0FF] flex items-center justify-center font-bold text-lg border border-[#1E2638]">
                1
              </div>
              <span className="text-xs font-mono uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                Triagem Imediata
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Mini-Quiz Dinâmico de Qualificação</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              O lead clica no anúncio e responde um quiz visual ultrarrápido de 3 perguntas. A IA identifica imediatamente o orçamento disponível, a urgência de compra e a necessidade específica, atribuindo um Score de 0 a 100 antes de qualquer atendente tocar no teclado.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#07090E] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#07090E] text-[#00F0FF] flex items-center justify-center font-bold text-lg border border-[#1E2638]">
                2
              </div>
              <span className="text-xs font-mono uppercase text-[#00F0FF] bg-slate-900 px-3 py-1 rounded-full border border-slate-700 font-semibold">
                Voz Humana
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Áudios Humanizados em Tempo Real (PTT)</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Chega de blocos gigantes de texto robótico. O MAI formula uma mensagem personalizada com base nas respostas do lead e dispara um áudio gravado na hora como se um consultor sênior estivesse segurando o microfone do WhatsApp naquele instante.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#07090E] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#07090E] text-[#00F0FF] flex items-center justify-center font-bold text-lg border border-[#1E2638]">
                3
              </div>
              <span className="text-xs font-mono uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 font-semibold">
                Equipe Organizada
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Distribuição Round-Robin & CRM Kanban</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              O comprador quente e qualificado é entregue automaticamente para a fila de vendedores da sua equipe em sistema circular justo (Round-Robin). O vendedor recebe a notificação no celular com o dossiê completo já pronto para o fechamento.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#07090E] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#07090E] text-[#00F0FF] flex items-center justify-center font-bold text-lg border border-[#1E2638]">
                4
              </div>
              <span className="text-xs font-mono uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-semibold">
                Otimização de Ads
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Atribuição Reversa Meta CAPI & Google Ads</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Quando uma venda é fechada no balcão ou WhatsApp, o MAI envia o evento de conversão de volta para o algoritmo do Meta/Google via API de Conversões. O algoritmo aprende quem são seus melhores clientes e barateia o custo por lead.
            </p>
          </div>

        </div>

      </section>

      {/* 7. TABELA COMPARATIVA (PROVA LÓGICA) */}
      <section id="comparativo" className="py-20 px-6 bg-[#07090E] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-mono uppercase text-[#00F0FF] tracking-wider font-bold">
              Comparação Racional • Decisão Sem Emoção
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Coloque as Opções Lado a Lado na Mesa
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                  <th className="py-4 px-6">Critério Comercial</th>
                  <th className="py-4 px-6 text-red-400">Atendimento Manual Puro</th>
                  <th className="py-4 px-6 text-amber-400">Chatbot de Árvore Tradicional</th>
                  <th className="py-4 px-6 text-[#00F0FF] bg-[#0F141F] rounded-t-xl border-t border-l border-r border-[#1E2638]">Plataforma MAI</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Tempo de Resposta Inicial</td>
                  <td className="py-4 px-6 text-slate-400">20 a 60 minutos (ou horas em feriados)</td>
                  <td className="py-4 px-6 text-slate-400">Instantâneo, mas frio</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-[#0F141F] border-l border-r border-[#1E2638]">&lt; 30 segundos (24/7/365)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Humanização do Primeiro Contato</td>
                  <td className="py-4 px-6 text-slate-400">Varia conforme o humor do atendente</td>
                  <td className="py-4 px-6 text-red-400">Zero ("Digite 1 para vendas")</td>
                  <td className="py-4 px-6 text-[#00F0FF] font-bold bg-[#0F141F] border-l border-r border-[#1E2638]">Áudios Humanizados Gravados (PTT)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Triagem de Renda & Orçamento</td>
                  <td className="py-4 px-6 text-slate-400">Manual (perde horas perguntando)</td>
                  <td className="py-4 px-6 text-slate-400">Formulário rígido chato</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-[#0F141F] border-l border-r border-[#1E2638]">Mini-Quiz Interativo com Score 0-100</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Custo Fixo Mensal</td>
                  <td className="py-4 px-6 text-red-400">R$ 3.000 a R$ 8.000 + Encargos / CLT</td>
                  <td className="py-4 px-6 text-slate-400">R$ 200 a R$ 500 (sem suporte a IA)</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-[#0F141F] border-l border-r border-[#1E2638]">A partir de R$ 497 / mês (Sem CLT)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Atribuição de Vendas ao Tráfego</td>
                  <td className="py-4 px-6 text-red-400">Nenhuma (achismo total)</td>
                  <td className="py-4 px-6 text-slate-400">Apenas clique</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-[#0F141F] border-l border-r border-[#1E2638]">Meta CAPI Reversa Nativa</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 8. CALCULADORA DE VAZAMENTO DE CAIXA */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-emerald-700 tracking-wider font-bold">
            Simulador de Impacto Financeiro
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Quanto Dinheiro a Sua Empresa Está Deixando na Mesa Todo Mês?
          </h2>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl border border-[#CBD5E1] bg-slate-50 shadow-2xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Leads de Anúncios Recebidos por Dia
                </label>
                <span className="font-mono text-lg font-bold text-[#07090E] bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {leadsPerDay} leads / dia
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={leadsPerDay}
                onChange={(e) => setLeadsPerDay(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#07090E]"
              />
              <span className="text-[11px] text-slate-500 block">Total de {leadsPorMes} pessoas chamando por mês.</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ticket Médio da Sua Venda / Contrato
                </label>
                <span className="font-mono text-lg font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  R$ {ticketMedio.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-[11px] text-slate-500 block">Valor médio recebido por cliente fechado.</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-white border border-red-200 space-y-1 shadow-sm">
              <span className="text-[11px] font-mono uppercase text-red-600 font-bold">Leads Perdidos Pela Demora</span>
              <div className="text-3xl font-extrabold font-mono text-red-600">~{leadsPerdidosPelaDemora}</div>
              <p className="text-[11px] text-slate-500">Pessoas que esfriaram enquanto esperavam atendimento.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
              <span className="text-[11px] font-mono uppercase text-slate-600 font-bold">Vendas Extras Fechadas (MAI)</span>
              <div className="text-3xl font-extrabold font-mono text-[#07090E]">+{vendasRecuperadas} contratos</div>
              <p className="text-[11px] text-slate-500">Recuperação realista de apenas 8% com resposta em 30s.</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500 text-white space-y-1 shadow-lg">
              <span className="text-[11px] font-mono uppercase text-emerald-100 font-bold">Caixa Adicional Todo Mês</span>
              <div className="text-3xl font-extrabold font-mono text-white">
                +R$ {faturamentoRecuperado.toLocaleString("pt-BR")}
              </div>
              <p className="text-[11px] text-emerald-100">Retorno estimado de {multiplicadorRoi}x o valor da assinatura Pro.</p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#07090E] hover:bg-[#161D2D] text-white font-bold text-sm shadow-xl transition border border-[#1E2638]"
            >
              <span className="text-[#00F0FF]">Recuperar Esse Faturamento Agora</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
            </Link>
          </div>

        </div>

      </section>

      {/* 9. TABELA DE PLANOS DE LICENCIAMENTO */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E2E8F0] space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#07090E] tracking-wider font-bold">
            Planos Comerciais • Transparência Total
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Investimento Que se Paga na Primeira Venda Recuperada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Starter */}
          <div className="p-8 rounded-3xl border border-[#CBD5E1] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Plano Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0B0D12]">R$ 497</span>
                <span className="text-xs text-slate-500 font-medium">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Ideal para corretores individuais, consultórios médicos ou pequenos lojistas.</p>
              
              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Até 2.500 mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>1 Conexão de WhatsApp</strong> (QR Code Nativo)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pipeline CRM Kanban com Drag-and-Drop</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1 Mini-Quiz Público de Qualificação</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[#0B0D12] font-bold text-xs transition text-center"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Pro Escala (DESTAQUE MÁXIMO) */}
          <div className="p-8 rounded-3xl border-2 border-[#07090E] bg-white space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#07090E] text-[#00F0FF] text-[11px] font-bold uppercase tracking-wider shadow-md border border-[#1E2638]">
              Mais Escolhido por Empresas
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#07090E] font-extrabold">Plano Pro Escala</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0B0D12]">R$ 997</span>
                <span className="text-xs text-slate-500 font-medium">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Para imobiliárias, concessionárias, clínicas e empresas com equipe comercial.</p>
              
              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#07090E] flex-shrink-0" />
                  <span><strong>Até 8.000 mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#07090E] flex-shrink-0" />
                  <span><strong>WhatsApp + Instagram Direct</strong> unificados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#07090E] flex-shrink-0" />
                  <span><strong>Áudios Humanizados Gravados (PTT)</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#07090E] flex-shrink-0" />
                  <span><strong>Equipe & Vendedores Ilimitados</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#07090E] flex-shrink-0" />
                  <span><strong>Roleta Round-Robin Automática de Leads</strong></span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-4 rounded-xl bg-[#07090E] hover:bg-[#161D2D] text-white font-bold text-xs transition text-center shadow-lg border border-[#1E2638]"
            >
              <span className="text-[#00F0FF]">Ativar Plano Pro Escala</span>
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl border border-[#CBD5E1] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">Plano Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0B0D12]">R$ 1.997</span>
                <span className="text-xs text-slate-500 font-medium">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Para grandes operações, concessionárias e indústrias com alto tráfego.</p>
              
              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>20.000+ mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>Meta CAPI Reversa Nativa</strong> (Atribuição Total)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>Visão Computacional</strong> (Fotos & Docs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Gerente de Contas Dedicado & Onboarding VIP</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[#0B0D12] font-bold text-xs transition text-center"
            >
              Contratar Enterprise
            </Link>
          </div>

        </div>

      </section>

      {/* 10. FAQ DE QUEBRA DE OBJEÇÕES */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#07090E] tracking-wider font-bold">Dúvidas Frequentes</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0D12]">
            Perguntas & Respostas Rápidas
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "O que é o MAI e como ele ajuda a minha empresa?",
              a: "O MAI é uma infraestrutura de inteligência comercial e atendimento imediato que conecta seus anúncios do Meta/Google ao WhatsApp. Ele qualifica o lead com um mini-quiz rápido de 3 perguntas e envia áudios humanizados gravados na hora em menos de 30 segundos, entregando o cliente pronto para o seu vendedor fechar."
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
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-sm text-[#0B0D12] hover:bg-slate-50 transition"
              >
                <span>{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === idx ? "rotate-90" : ""}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. RODAPÉ INSTITUCIONAL MAI */}
      <footer className="border-t border-[#E2E8F0] bg-[#07090E] text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF] text-[#07090E] flex items-center justify-center font-black">
                Ω
              </div>
              <span>MAI — Motor de Atendimento & Inteligência</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Infraestrutura de alta performance para qualificação de leads de tráfego pago e fechamento de vendas no WhatsApp com inteligência artificial e áudios humanizados.
            </p>
            <div className="text-[11px] text-slate-500">
              &copy; {new Date().getFullYear()} MAI Platform. Todos os direitos reservados.
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Recursos</span>
            <ul className="space-y-2">
              <li><a href="#como-funciona" className="hover:text-white transition">Como Funciona</a></li>
              <li><a href="#diagnostico" className="hover:text-white transition">O Gargalo Oculto</a></li>
              <li><a href="#calculadora" className="hover:text-white transition">Calculadora de ROI</a></li>
              <li><a href="#planos" className="hover:text-white transition">Planos e Preços</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Acesso Direto</span>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white transition">Login no Cockpit</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition">Ativar Operação</Link></li>
              <li><Link href="/quiz/omni-demo" target="_blank" className="hover:text-[#00F0FF] transition">Demonstração Interativa</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
