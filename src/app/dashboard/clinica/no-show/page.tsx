import { requireAuth } from "@/lib/session";
import { ClockAlert, Sparkles, UserX, ShieldCheck } from "lucide-react";

export default async function NoShowClinicaPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
            🏥 Módulo Clínicas & Saúde
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Painel de Prevenção de Faltas (Anti No-Show)
        </h1>
        <p className="text-xs text-gray-400">
          Régua de confirmação com disparo de botões interativos (&ldquo;Confirmar&rdquo; / &ldquo;Remarcar&rdquo;) 24h e 2h antes da consulta.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 mx-auto flex items-center justify-center">
          <ClockAlert className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Motor Anti No-Show</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Reduz a taxa de faltas de 28% para menos de 6% com confirmação ativa. Previsto para a <strong>Etapa 5</strong>.
        </p>
      </div>
    </div>
  );
}
