import Link from "next/link";
import { Mail, Clock, MessageSquare, ArrowLeft, Headphones, HelpCircle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Central de Suporte e Atendimento | OMNAI (OmniBDR)",
  description: "Canais oficiais de atendimento ao cliente, suporte técnico e orientações de uso da plataforma OMNAI.",
};

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "suporte@omnibdr.com.br";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://omnisdr-app.vercel.app";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-zinc-900">
            <span className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-extrabold">Ω</span>
            <span>OMNAI (OmniBDR)</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 sm:py-16 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700 mb-6">
          <Headphones className="w-3.5 h-3.5 text-zinc-900" />
          <span>Atendimento & Suporte Técnico</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-4">
          Como podemos ajudar você?
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-8">
          Nossa equipe de engenharia e suporte ao cliente está à disposição para auxiliar na configuração de integrações, dúvidas sobre o Motor MAI e questões operacionais.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* E-mail */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Suporte por E-mail</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Para suporte técnico, solicitações de integração, dúvidas de cobrança ou assuntos regulatórios:
            </p>
            <div className="p-2.5 bg-white border border-zinc-300 rounded-lg font-mono text-xs font-bold text-zinc-900 w-fit">
              {supportEmail}
            </div>
          </div>

          {/* Horário */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-900">Horário de Atendimento</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Equipe humana disponível de:
            </p>
            <div className="text-xs font-semibold text-zinc-900 space-y-1">
              <div>Segunda a Sexta-feira: 09:00 às 18:00 (Horário de Brasília)</div>
              <div className="text-zinc-500 font-normal">Motor MAI e monitoramento de webhooks operando 24 horas por dia, 7 dias por semana.</div>
            </div>
          </div>
        </div>

        {/* Links Úteis */}
        <section className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-900" />
            Dúvidas Frequentes & Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a href={`${appUrl}/login`} className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 transition block">
              <div className="font-bold text-zinc-900">Acessar Painel B2B</div>
              <div className="text-zinc-500 mt-0.5">Acesse suas configurações de WhatsApp, RAG e CRM.</div>
            </a>
            <Link href="/data-deletion" className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 transition block">
              <div className="font-bold text-zinc-900">Solicitação de Exclusão de Dados</div>
              <div className="text-zinc-500 mt-0.5">Orientações nos termos da LGPD e regras da Meta.</div>
            </Link>
            <Link href="/privacy" className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 transition block">
              <div className="font-bold text-zinc-900">Política de Privacidade</div>
              <div className="text-zinc-500 mt-0.5">Como tratamos dados e garantimos segurança.</div>
            </Link>
            <Link href="/terms" className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 transition block">
              <div className="font-bold text-zinc-900">Termos de Uso</div>
              <div className="text-zinc-500 mt-0.5">Diretrizes de serviço e responsabilidades.</div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-zinc-50 text-xs text-zinc-500 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <span>Suporte oficial OMNAI Platform.</span>
          </div>
          <div>© {new Date().getFullYear()} OmniBDR / OMNAI Platform.</div>
        </div>
      </footer>
    </div>
  );
}
