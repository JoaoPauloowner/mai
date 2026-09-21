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
  CalendarCheck,
  DollarSign,
  Layers,
  Bot,
  RefreshCw,
} from "lucide-react";

export default function LandingPage() {
  const [leadsPerDay, setLeadsPerDay] = useState(35);
  const [ticketMedio, setTicketMedio] = useState(2500);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Calculo de ROI e Vazamento de Caixa Incontestavel (Clayton Makepeace Proof Framework)
  const leadsPorMes = leadsPerDay * 30;
  // Pesquisa de mercado indica perda de 70% dos leads se respondidos apos 15 minutos
  const leadsPerdidosPelaDemora = Math.round(leadsPorMes * 0.45); 
  // Com o MAI recuperando apenas 8% desses leads perdidos com resposta em 30 segundos
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
    <div className="min-h-screen bg-white text-[#0B0D12] selection:bg-[#0A1F3B] selection:text-white font-sans antialiased">
      
      {/* 1. Barra de Alerta Superior (Pre-Headline Makepeace Hook) */}
      <div className="bg-[#0A1F3B] text-white py-3 px-4 text-center text-xs font-medium border-b border-[#13325B] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00DDD7] animate-pulse" />
          <span>
            <strong>ALERTA DE CAIXA PARA EMPRESAS QUE INVESTEM EM ANÚNCIOS:</strong> 78% dos clientes compram da <em>primeira</em> empresa que responde no WhatsApp. Em quantos minutos sua equipe atende hoje?
          </span>
        </div>
      </div>

      {/* 2. Header / Navbar Executiva de Alta Autoridade */}
      <header className="h-20 border-b border-[#D7DBE0]/70 bg-white/95 backdrop-blur-xl sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1F3B] text-white font-bold text-xl flex items-center justify-center shadow-md border border-[#13325B]">
              Ω
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0B0D12]">
                MAI <span className="text-[#0A1F3B] text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200 ml-1">Motor de Atendimento</span>
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#5F6673]">
            <a href="#diagnostico" className="hover:text-[#0A1F3B] transition">O Gargalo Oculto</a>
            <a href="#mecanismo" className="hover:text-[#0A1F3B] transition">A Engenharia dos 30s</a>
            <a href="#comparativo" className="hover:text-[#0A1F3B] transition">Humano vs Bot vs MAI</a>
            <a href="#calculadora" className="hover:text-[#0A1F3B] transition">Calculadora de Caixa</a>
            <a href="#planos" className="hover:text-[#0A1F3B] transition">Planos & Investimento</a>
            <a href="#faq" className="hover:text-[#0A1F3B] transition">Perguntas Frequentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#344054] hover:text-[#0A1F3B] hover:bg-slate-50 transition"
            >
              Acessar Cockpit
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 rounded-lg bg-[#0A1F3B] hover:bg-[#13325B] text-white text-xs font-semibold transition shadow-md flex items-center gap-1.5"
            >
              <span>Ativar Minha Operação</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION DENSE COPYWRITING (CLAYTON MAKEPEACE STRUCTURE) */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-5 max-w-5xl mx-auto">
          
          {/* Eyebrow / Pre-Headline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-[#0A1F3B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="uppercase tracking-wider">A Solução Definitiva Para o Vício de Queimar Dinheiro em Tráfego Pago</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B0D12] leading-[1.06]">
            Enquanto Sua Equipe Demora 30 Minutos Para Responder,{" "}
            <span className="text-[#0A1F3B] underline decoration-[#00DDD7] decoration-wavy decoration-2">
              Seu Concorrente Já Fechou a Venda.
            </span>
          </h1>

          {/* Deck Copy (Clayton Makepeace Lead) */}
          <p className="text-base sm:text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed font-normal">
            Não adianta colocar mais R$ 5.000 no Meta ou Google Ads se o seu cliente qualificado espera 40 minutos por uma mensagem no WhatsApp. O <strong>MAI</strong> intercepta o lead no instante exato do clique, aplica um <strong>Mini-Quiz de Triagem</strong>, responde com <strong>Áudios Gravados na Hora (PTT)</strong> com voz humana e entrega o cliente pronto no colo do seu melhor vendedor.
          </p>

          {/* Duplo CTA de Conversão Imediata */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto flex-1 min-h-[54px] px-8 rounded-xl bg-[#0A1F3B] hover:bg-[#13325B] text-white font-bold text-sm transition shadow-[0_10px_30px_rgba(10,31,59,0.25)] flex items-center justify-center gap-2"
            >
              <span>Blindar Meu WhatsApp em 30s</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quiz/omni-demo"
              target="_blank"
              className="w-full sm:w-auto flex-1 min-h-[54px] px-8 rounded-xl border-2 border-[#D7DBE0] bg-white hover:bg-slate-50 text-[#0B0D12] font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 text-[#0A1F3B]" />
              <span>Testar a IA no Meu Celular</span>
            </Link>
          </div>

          {/* Micro-Garantia e Redutores de Ansiedade */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sem fidelidade contratual
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#0A1F3B]" /> Ativação em menos de 10 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-600" /> WhatsApp Oficial ou QR Code
            </span>
          </div>
        </div>

        {/* 4. Mockup Interativo do Cockpit Live (A Prova Visual de Operação) */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#CBD5E1] bg-[#0A1F3B] p-3 sm:p-4 shadow-[0_30px_70px_rgba(10,31,59,0.25)]">
            <div className="rounded-xl bg-[#0B0D12] text-white overflow-hidden border border-[#1E293B]">
              
              {/* Header do Cockpit */}
              <div className="h-11 bg-[#07090E] border-b border-[#1E293B] px-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-300 font-semibold hidden sm:inline">MAI Enterprise • Engine Operacional Ativa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00DDD7] animate-pulse" />
                  <span className="text-[#00DDD7] font-semibold text-[11px]">Speed-to-Lead: 14 Segundos</span>
                </div>
              </div>

              {/* Grid Interno do Dashboard com Prova Lógica */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                
                {/* Card 1: Triagem com Score */}
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E293B] space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>1. TRIAGEM DE URGÊNCIA</span>
                    <Flame className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-emerald-400">Score 98/100</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">ALTO TICKET</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lead concluiu o Mini-Quiz: Orçamento de R$ 120.000 aprovado e decisão de compra para esta semana.
                  </p>
                </div>

                {/* Card 2: Áudio Humanizado PTT */}
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E293B] space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>2. ÁUDIO HUMANIZADO (PTT)</span>
                    <Volume2 className="w-4 h-4 text-[#00DDD7]" />
                  </div>
                  
                  {/* Player Simulado */}
                  <div className="p-2.5 rounded-lg bg-[#0C101A] border border-[#1E293B] flex items-center gap-3">
                    <button
                      onClick={handlePlayDemoAudio}
                      className="w-8 h-8 rounded-full bg-[#00DDD7] text-[#0A1F3B] flex items-center justify-center font-bold text-xs hover:scale-105 transition"
                    >
                      {isPlayingAudio ? "⏸" : "▶"}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#00DDD7] ${isPlayingAudio ? "w-full transition-all duration-[4000ms]" : "w-1/3"}`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>0:14</span>
                        <span>{isPlayingAudio ? "Tocando..." : "Simular Voz Humana"}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 block">
                    💬 "Olá Carlos! Vi que você selecionou o modelo SUV no anúncio. Consegui uma condição especial..."
                  </span>
                </div>

                {/* Card 3: Atribuição de Dinheiro Real (CAPI) */}
                <div className="p-4 rounded-xl bg-[#111622] border border-[#1E293B] space-y-3">
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

      {/* 5. A ANATOMIA DO SANGRAMENTO (O DIAGNÓSTICO BRUTAL DE MERCADO) */}
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
              A maioria dos empresários acredita que o problema está na agência de marketing, no criativo do anúncio ou no público do Facebook. <strong>A verdade é muito mais dura e matemática:</strong>
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

          {/* Callout Box Clayton Makepeace: A Revelação */}
          <div className="p-8 rounded-2xl bg-[#0A1F3B] text-white space-y-4 max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center gap-3 text-[#00DDD7] font-mono text-xs uppercase font-bold">
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

      {/* 6. O MECANISMO ÚNICO (THE BIG IDEA: A ENGENHARIA DE FECHAMENTO MAI) */}
      <section id="mecanismo" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-bold">
            O Mecanismo Único • Tecnologia Proprietária
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Como o MAI Transforma Cliques Frios em Contratos Assinados em 4 Etapas
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            Uma estrutura automatizada que opera 24 horas por dia, 7 dias por semana, sem férias, sem atestado e sem demoras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Pilar 1 */}
          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center font-bold text-lg">
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
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">✓ Elimina 100% dos curiosos sem orçamento</li>
              <li className="flex items-center gap-2">✓ Gera dossiê comercial 360° automático</li>
            </ul>
          </div>

          {/* Pilar 2 */}
          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <span className="text-xs font-mono uppercase text-[#00DDD7] bg-slate-900 px-3 py-1 rounded-full border border-slate-700 font-semibold">
                Voz Humana
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Áudios Humanizados em Tempo Real (PTT)</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Chega de blocos gigantes de texto robótico. O MAI formula uma mensagem personalizada com base nas respostas do lead e dispara um áudio gravado na hora como se um consultor sênior estivesse segurando o microfone do WhatsApp naquele instante.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">✓ Taxa de escuta e resposta superior a 85%</li>
              <li className="flex items-center gap-2">✓ Quebra instantânea do ceticismo do comprador</li>
            </ul>
          </div>

          {/* Pilar 3 */}
          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center font-bold text-lg">
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
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">✓ Fim das brigas internas de vendedores por leads</li>
              <li className="flex items-center gap-2">✓ Pipeline visual de negociação sem perder follow-up</li>
            </ul>
          </div>

          {/* Pilar 4 */}
          <div className="p-8 rounded-2xl border border-[#CBD5E1] bg-white hover:border-[#0A1F3B] transition space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#0A1F3B] text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <span className="text-xs font-mono uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-semibold">
                Otimização de Anúncios
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0B0D12]">Atribuição Reversa Meta CAPI & Google Ads</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Quando uma venda de R$ 10.000 ou R$ 50.000 é fechada no balcão ou WhatsApp, o MAI envia o evento de conversão de volta para o algoritmo do Meta/Google via API de Conversões. O algoritmo aprende quem são seus melhores clientes e barateia o custo por lead.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">✓ Custo por lead (CPL) cai progressivamente</li>
              <li className="flex items-center gap-2">✓ Fim da cegueira sobre qual anúncio realmente vende</li>
            </ul>
          </div>

        </div>

      </section>

      {/* 7. TABELA COMPARATIVA (PROVA LÓGICA: O VELHO JEITO VS O JEITO MAI) */}
      <section id="comparativo" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-mono uppercase text-[#00DDD7] tracking-wider font-bold">
              Comparação Racional • Decisão Sem Emoção
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Coloque as Opções Lado a Lado na Mesa
            </h2>
            <p className="text-base text-slate-300">
              Veja por que depender apenas de humanos lentos ou bots arcaicos está custando caro para o seu negócio.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-700 text-xs font-mono uppercase text-slate-400">
                  <th className="py-4 px-6">Critério Comercial</th>
                  <th className="py-4 px-6 text-red-400">Atendimento Manual Puro</th>
                  <th className="py-4 px-6 text-amber-400">Chatbot de Árvore (Typebot/Z-API)</th>
                  <th className="py-4 px-6 text-[#00DDD7] bg-slate-800/80 rounded-t-xl">Plataforma MAI</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Tempo de Resposta Inicial</td>
                  <td className="py-4 px-6 text-slate-400">20 a 60 minutos (ou horas em feriados)</td>
                  <td className="py-4 px-6 text-slate-400">Instantâneo, mas frio</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-slate-800/80">&lt; 30 segundos (24/7/365)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Humanização do Primeiro Contato</td>
                  <td className="py-4 px-6 text-slate-400">Varia conforme o humor do atendente</td>
                  <td className="py-4 px-6 text-red-400">Zero ("Digite 1 para vendas")</td>
                  <td className="py-4 px-6 text-[#00DDD7] font-bold bg-slate-800/80">Áudios Humanizados Gravados (PTT)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Triagem de Renda & Orçamento</td>
                  <td className="py-4 px-6 text-slate-400">Manual (perde horas perguntando)</td>
                  <td className="py-4 px-6 text-slate-400">Formulário rígido chato</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-slate-800/80">Mini-Quiz Interativo com Score 0-100</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Custo Fixo Mensal</td>
                  <td className="py-4 px-6 text-red-400">R$ 3.000 a R$ 8.000 + Encargos / CLT</td>
                  <td className="py-4 px-6 text-slate-400">R$ 200 a R$ 500 (sem suporte a IA)</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-slate-800/80">A partir de R$ 497 / mês (Sem CLT)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-200">Atribuição de Vendas ao Tráfego</td>
                  <td className="py-4 px-6 text-red-400">Nenhuma (achismo total)</td>
                  <td className="py-4 px-6 text-slate-400">Apenas clique</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold bg-slate-800/80">Meta CAPI Reversa Nativa</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 8. CALCULADORA DE VAZAMENTO DE CAIXA (PROVA MATEMÁTICA INCONTESTÁVEL) */}
      <section id="calculadora" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-emerald-700 tracking-wider font-bold">
            Simulador de Impacto Financeiro
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Quanto Dinheiro a Sua Empresa Está Deixando na Mesa Todo Mês?
          </h2>
          <p className="text-sm text-[#475569]">
            Ajuste os números da sua operação atual para calcular o faturamento adicional que o MAI recupera.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl border border-[#CBD5E1] bg-slate-50/80 shadow-2xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slider 1: Leads por dia */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Leads de Anúncios Recebidos por Dia
                </label>
                <span className="font-mono text-lg font-bold text-[#0A1F3B] bg-white px-3 py-1 rounded-lg border border-slate-200">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0A1F3B]"
              />
              <span className="text-[11px] text-slate-500 block">Total de {leadsPorMes} pessoas chamando por mês.</span>
            </div>

            {/* Slider 2: Ticket Médio */}
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

          {/* O Diagnóstico Numérico de Caixa */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-white border border-red-200 space-y-1 shadow-sm">
              <span className="text-[11px] font-mono uppercase text-red-600 font-bold">Leads Perdidos Pela Demora</span>
              <div className="text-3xl font-extrabold font-mono text-red-600">~{leadsPerdidosPelaDemora}</div>
              <p className="text-[11px] text-slate-500">Pessoas que esfriaram enquanto esperavam atendimento.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
              <span className="text-[11px] font-mono uppercase text-slate-600 font-bold">Vendas Extras Fechadas (MAI)</span>
              <div className="text-3xl font-extrabold font-mono text-[#0A1F3B]">+{vendasRecuperadas} contratos</div>
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0A1F3B] hover:bg-[#13325B] text-white font-bold text-sm shadow-xl transition"
            >
              <span>Recuperar Esse Faturamento Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>

      {/* 9. TABELA DE PLANOS DE LICENCIAMENTO TRANSPARENTE */}
      <section id="planos" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E2E8F0] space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-bold">
            Planos Comerciais • Transparência Total
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0D12]">
            Investimento Que se Paga na Primeira Venda Recuperada
          </h2>
          <p className="text-sm text-[#475569]">
            Sem letras miúdas, sem fidelidade e com ativação imediata. Cancele quando quiser com 1 clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plano Starter */}
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
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Notificações de Novos Leads em Tempo Real</span>
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

          {/* Plano Pro Escala (DESTAQUE MÁXIMO) */}
          <div className="p-8 rounded-3xl border-2 border-[#0A1F3B] bg-white space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0A1F3B] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              Mais Escolhido por Empresas em Crescimento
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#0A1F3B] font-extrabold">Plano Pro Escala</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0B0D12]">R$ 997</span>
                <span className="text-xs text-slate-500 font-medium">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Para imobiliárias, concessionárias, clínicas e empresas com equipe de vendas.</p>
              
              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span><strong>Até 8.000 mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span><strong>WhatsApp + Instagram Direct</strong> unificados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span><strong>Áudios Humanizados Gravados (PTT)</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span><strong>Vendedores e Usuários Ilimitados</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span><strong>Roleta Round-Robin Automática de Leads</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0A1F3B] flex-shrink-0" />
                  <span>Agendamento de Visitas & Reuniões com 1 clique</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cadastro"
              className="w-full py-4 rounded-xl bg-[#0A1F3B] hover:bg-[#13325B] text-white font-bold text-xs transition text-center shadow-lg"
            >
              Ativar Plano Pro Escala
            </Link>
          </div>

          {/* Plano Enterprise */}
          <div className="p-8 rounded-3xl border border-[#CBD5E1] bg-white space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">Plano Enterprise</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0B0D12]">R$ 1.997</span>
                <span className="text-xs text-slate-500 font-medium">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Para grandes operações, concessionárias de grande porte e indústrias.</p>
              
              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>20.000+ mensagens de IA</strong> / mês</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>Meta CAPI Reversa Nativa</strong> (Atribuição de Ads)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span><strong>Visão Computacional</strong> (Inspeção de Fotos & Docs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Múltiplos Números de WhatsApp Simultâneos</span>
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

      {/* 10. GARANTIA BLINDADA DE REVERSÃO TOTAL DE RISCO (CLAYTON MAKEPEACE RISK REVERSAL) */}
      <section className="py-16 px-6 bg-slate-50 border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto rounded-3xl border-2 border-dashed border-[#0A1F3B]/30 p-8 sm:p-12 bg-white text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-emerald-800 font-bold tracking-wider">
              Compromisso de Risco Zero Absoluto
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B0D12]">
              Ou a Sua Operação Vende Mais Rápido, Ou Você Não Paga Nada
            </h3>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed max-w-2xl mx-auto">
            Você não assume nenhum risco. Se dentro dos primeiros <strong>7 dias</strong> você achar que a velocidade do MAI não recuperou as vendas perdidas no seu WhatsApp, basta clicar em "Cancelar Assinatura" dentro do seu painel e devolveremos 100% do seu investimento. Sem burocracia, sem perguntas e sem ressentimentos.
          </p>
          <div className="pt-2">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0A1F3B] hover:bg-[#13325B] text-white font-bold text-xs shadow-lg transition"
            >
              <span>Testar Sem Risco por 7 Dias</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FAQ ESTRUTURADO PARA QUEBRA DE OBJEÇÕES COMERCIAIS */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono uppercase text-[#0A1F3B] tracking-wider font-bold">Perguntas Frequentes</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0D12]">
            Tire Suas Dúvidas Técnicas e Comerciais
          </h2>
        </div>

        <div className="space-y-4">
          
          {[
            {
              q: "Preciso trocar o meu número atual do WhatsApp para usar o MAI?",
              a: "Não! O MAI se conecta ao número que a sua empresa já utiliza hoje através de leitura de QR Code em menos de 1 minuto, ou através da API Oficial Cloud da Meta caso você prefira."
            },
            {
              q: "O cliente percebe que está conversando com uma Inteligência Artificial?",
              a: "Não. Diferente de bots comuns de opções numéricas ('Digite 1 para isso'), o MAI utiliza modelos avançados de linguagem treinados com o tom de voz da sua empresa e envia áudios simulados de voz humana real, criando uma experiência calorosa e pessoal."
            },
            {
              q: "Como meus vendedores recebem os clientes qualificados?",
              a: "Assim que o cliente conclui a triagem com urgência e orçamento confirmado, o MAI distribui o lead automaticamente entre os seus vendedores cadastrados via Round-Robin e envia o resumo completo com telefone e preferências direto para a tela do CRM."
            },
            {
              q: "Quanto tempo demora para colocar a plataforma no ar?",
              a: "Menos de 10 minutos. Basta criar sua conta, conectar o WhatsApp via QR Code, configurar as 3 perguntas do seu nicho e você já está pronto para receber e converter leads."
            },
            {
              q: "Existe contrato de fidelidade ou multa por cancelamento?",
              a: "Nenhum. Nossos planos são mensais recorrentes. Você pode cancelar sua assinatura a qualquer momento com apenas 1 clique dentro das configurações da sua conta."
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

      {/* 12. RODAPÉ INSTITUCIONAL B2B */}
      <footer className="border-t border-[#D7DBE0] bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-[#00DDD7] text-[#0A1F3B] flex items-center justify-center font-black">
                Ω
              </div>
              <span>MAI — Motor de Atendimento & Inteligência</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Infraestrutura comercial de alta performance para conversão de tráfego pago em vendas no WhatsApp em menos de 30 segundos.
            </p>
            <div className="text-[11px] text-slate-500">
              &copy; {new Date().getFullYear()} MAI Platform. Todos os direitos reservados.
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Navegação Rápida</span>
            <ul className="space-y-2">
              <li><a href="#diagnostico" className="hover:text-white transition">O Gargalo Invisível</a></li>
              <li><a href="#mecanismo" className="hover:text-white transition">Como o MAI Funciona</a></li>
              <li><a href="#calculadora" className="hover:text-white transition">Calculadora de ROI</a></li>
              <li><a href="#planos" className="hover:text-white transition">Planos e Preços</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase font-mono tracking-wider">Acesso ao Sistema</span>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white transition">Login no Cockpit</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition">Criar Conta Comercial</Link></li>
              <li><Link href="/quiz/omni-demo" target="_blank" className="hover:text-[#00DDD7] transition">Demonstração Interativa</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
