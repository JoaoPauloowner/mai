import { requireAuth } from "@/lib/session";
import { ShieldCheck, Sparkles, Clock, AlertTriangle } from "lucide-react";

export default async function RadarRenovacoesPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            🛡️ Módulo Corretora de Seguros
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Radar Preditivo de Renovações de Apólices
        </h1>
        <p className="text-xs text-gray-400">
          Monitoramento automático de apólices com régua de contato inteligente (D-30, D-15, D-7) via WhatsApp e ligação por voz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Vencendo em 30 Dias</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">24 apólices</div>
          <p className="text-[10px] text-gray-500 mt-1">Disparos de aviso programados</p>
        </div>

        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Urgência: Vencendo em 7 Dias</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">8 apólices</div>
          <p className="text-[10px] text-gray-500 mt-1">Acionamento prioritário da corretora</p>
        </div>

        <div className="p-4 rounded-xl bg-[#111622] border border-[#1e2638]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Taxa de Retenção de Carteira</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">93.4%</div>
          <p className="text-[10px] text-gray-500 mt-1">Zero perdas por esquecimento</p>
        </div>
      </div>
    </div>
  );
}
