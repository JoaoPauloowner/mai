import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ShieldCheck, MessageSquare, Flame, Sparkles, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  if (session?.userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-between selection:bg-[#00ddd7] selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-[#1e2638] px-8 py-5 flex items-center justify-between glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(0,221,215,0.4)]">
            Ω
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
              Omni Service SaaS
              <span className="text-xs bg-[#00ddd7]/10 text-[#00ddd7] border border-[#00ddd7]/30 px-2 py-0.5 rounded-full font-mono font-medium">
                v1.0 Core
              </span>
            </h1>
            <p className="text-xs text-gray-400">Atribuição de Marketing Ponta a Ponta & IA Vertical</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg bg-[#00ddd7] hover:bg-[#00c4be] text-black font-semibold text-sm transition-all duration-150 shadow-[0_0_15px_rgba(0,221,215,0.3)] hover:shadow-[0_0_25px_rgba(0,221,215,0.5)] flex items-center gap-2"
          >
            Acessar Plataforma <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161d2d] border border-[#2e3b54] text-xs text-[#00ddd7] mb-8 font-mono">
          <Sparkles className="w-3.5 h-3.5" /> Service-as-a-Software: ChatFunnel + SellFlux + Vapi
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Unifique seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ddd7] via-[#38bdf8] to-[#818cf8]">Tráfego Pago</span> ao Comercial com IA e Atribuição Total
        </h2>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Do clique no anúncio (Meta/Google), palavra-chave do Instagram Direct até a conversão no WhatsApp com simulação de áudio PTT e CRM Kanban inteligente.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00ddd7] to-[#38bdf8] text-black font-bold text-base shadow-[0_0_30px_rgba(0,221,215,0.4)] hover:opacity-95 transition"
          >
            Entrar como Administrador
          </Link>
          <Link
            href="/quiz/captacao-geral"
            className="px-8 py-3.5 rounded-xl bg-[#161d2d] border border-[#2e3b54] hover:border-[#00ddd7] text-white font-medium text-base transition flex items-center gap-2"
          >
            Testar Mini-Quiz Público <ArrowRight className="w-4 h-4 text-[#00ddd7]" />
          </Link>
        </div>

        {/* Vertical Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20 text-left">
          <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#f59e0b]/50 transition">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center font-bold text-sm mb-3">
              🚗
            </div>
            <h3 className="font-semibold text-white mb-1">Setor Automotivo</h3>
            <p className="text-xs text-gray-400">Pátio de seminovos, avaliação de usados com fotos e agendamento de test-drive.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#3b82f6]/50 transition">
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center font-bold text-sm mb-3">
              🛡️
            </div>
            <h3 className="font-semibold text-white mb-1">Corretora Seguros</h3>
            <p className="text-xs text-gray-400">Radar preditivo de renovações, multicálculo e ligação ativa com IA de voz.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#10b981]/50 transition">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center font-bold text-sm mb-3">
              📊
            </div>
            <h3 className="font-semibold text-white mb-1">Contábil & Fiscal</h3>
            <p className="text-xs text-gray-400">Guias com PIX copia e cola, auditoria de XMLs e helpdesk departamental.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#ec4899]/50 transition">
            <div className="w-8 h-8 rounded-lg bg-[#ec4899]/10 text-[#ec4899] flex items-center justify-center font-bold text-sm mb-3">
              🏥
            </div>
            <h3 className="font-semibold text-white mb-1">Clínicas & Saúde</h3>
            <p className="text-xs text-gray-400">Confirmação automática de consultas 24h antes e controle drástico de no-show.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2638] px-8 py-6 text-center text-xs text-gray-500">
        Omni Service SaaS &copy; 2026 — Arquitetura Unificada de Alta Performance.
      </footer>
    </main>
  );
}
