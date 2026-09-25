import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Zap, MessageSquare, Target, CheckCircle2, Sparkles } from "lucide-react";

export default function LandingPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://omnisdr-app.vercel.app";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-zinc-900">
            <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-sm font-extrabold">
              AI
            </span>
            <span>OmniSDR</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`${appUrl}/quiz/omni-demo`}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition hidden sm:inline-block"
            >
              Diagnóstico Gratuito
            </a>
            <a
              href={`${appUrl}/login`}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
            >
              Entrar
            </a>
            <a
              href={`${appUrl}/cadastro`}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <span>Criar Conta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>SDR com IA 24/7 para WhatsApp & Instagram</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 max-w-3xl leading-tight">
          Transforme conversas no WhatsApp e Direct em <span className="underline decoration-zinc-300">vendas fechadas</span>.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
          SDRs com Inteligência Artificial treinados no seu catálogo e regras de negócio para responder em menos de 5 segundos, qualificar leads e agendar reuniões comerciais no piloto automático.
        </p>

        {/* CTA Area */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <a
            href={`${appUrl}/cadastro`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            Começar Teste Grátis <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`${appUrl}/quiz/omni-demo`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            Fazer Diagnóstico Comercial
          </a>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Teste imediato</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sem cartão de crédito</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-segmento</span>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">WhatsApp & Instagram</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Integração nativa com Meta Cloud API. Respostas em texto e áudio humanizado instantâneas.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">RAG & Base de Conhecimento</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Faça upload de PDFs, tabelas de preços e manuais. A IA responde estritamente conforme suas diretrizes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">Atribuição de Tráfego & CRM</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Rastreamento ponta a ponta de UTMs do Meta Ads e palavras-chave de Direct direto no Pipeline CRM Kanban.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <span>Infraestrutura em conformidade com a LGPD e criptografia de ponta a ponta.</span>
          </div>
          <div>© {new Date().getFullYear()} OmniSDR B2B. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  );
}

