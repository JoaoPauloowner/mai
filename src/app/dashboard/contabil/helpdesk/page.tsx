import { requireAuth } from "@/lib/session";
import { LifeBuoy, Sparkles } from "lucide-react";

export default async function HelpdeskContabilPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            📊 Módulo Contábil & Fiscal
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Helpdesk Contábil Departamental
        </h1>
        <p className="text-xs text-gray-400">
          Triagem e roteamento inteligente de solicitações do cliente para os departamentos Fiscal, DP, Societário ou Legal.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Fila de Chamados Departamental</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Previsto para a <strong>Etapa 4</strong> da implementação.
        </p>
      </div>
    </div>
  );
}
