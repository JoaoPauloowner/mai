import { requireAuth } from "@/lib/session";
import { ReceiptText, QrCode, Sparkles } from "lucide-react";

export default async function GuiasContabilPage() {
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
          Emissão de Guias Tributárias com PIX Copia e Cola
        </h1>
        <p className="text-xs text-gray-400">
          Disparo automático de DAS, DARF e FGTS pelo WhatsApp com código de barras, PIX instantâneo e régua D-3, D-0 e D+1.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Central de Cobrança e Guias Fiscais</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Previsto para a <strong>Etapa 4</strong>: painel de controle com status de visualização pelo cliente e confirmação de pagamento via webhook PIX.
        </p>
      </div>
    </div>
  );
}
