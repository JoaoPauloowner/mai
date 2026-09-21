import { requireAuth } from "@/lib/session";
import { Sparkles, FileCheck2, Camera } from "lucide-react";

export default async function AvaliacaoUsadosPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            🚗 Módulo Automotivo Especializado
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Avaliação de Usados na Troca (Visão Computacional)
        </h1>
        <p className="text-xs text-gray-400">
          Recepção de fotos enviadas pelo cliente no WhatsApp (frente, lateral, painel) com inspeção por GPT-4o Vision.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Motor de Triagem Visual Automotiva</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Este módulo será detalhado e calibrado na <strong>Etapa 2</strong> da implementação com upload e inspeção de avarias, estado dos pneus e estimativa prévia de FIPE.
        </p>
      </div>
    </div>
  );
}
