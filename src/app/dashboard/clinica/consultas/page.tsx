import { requireAuth } from "@/lib/session";
import { Stethoscope, Calendar, Sparkles } from "lucide-react";

export default async function ConsultasClinicaPage() {
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
          Agenda de Consultas Médicas & Odontológicas
        </h1>
        <p className="text-xs text-gray-400">
          Agendamento automatizado de procedimentos e consultas com preenchimento prévio de anamnese via WhatsApp.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111622] border border-[#1e2638] text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 mx-auto flex items-center justify-center">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Agenda Multiprofissional</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Construção programada para a <strong>Etapa 5</strong> da implementação.
        </p>
      </div>
    </div>
  );
}
