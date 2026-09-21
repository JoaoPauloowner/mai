import { requireAuth } from "@/lib/session";
import { FileText, Sparkles, CheckCircle } from "lucide-react";

export default async function AuditoriaXmlPage() {
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
          Auditoria & Conciliação de XMLs de NF-e
        </h1>
        <p className="text-xs text-gray-400">
          Recepção de notas fiscais e comprovantes bancários com validação de CFOP, impostos retidos e conciliação prévia.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Auditor Fiscal Automatizado</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Construção detalhada na <strong>Etapa 4</strong> da implementação.
        </p>
      </div>
    </div>
  );
}
