import { requireAuth } from "@/lib/session";
import { Scale, Sparkles } from "lucide-react";

export default async function CotacoesSegurosPage() {
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
          Multicálculo & Comparativo de Seguradoras
        </h1>
        <p className="text-xs text-gray-400">
          Matriz comparativa de prêmio, franquia e comissões entre Porto Seguro, Allianz, Bradesco, Tokio Marine e HDI.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Motor de Cotações Integrado</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Este painel será entregue na <strong>Etapa 3</strong> com tabelas interativas de cotações geradas em segundos e envio de PDF resumido pelo WhatsApp do cliente.
        </p>
      </div>
    </div>
  );
}
