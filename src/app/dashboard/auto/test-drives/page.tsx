import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export default async function TestDrivesPage() {
  const session = await requireAuth();

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: session.organizationId,
      tipo: "TEST_DRIVE",
    },
    include: { lead: true },
    orderBy: { dataHorario: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            🚗 Módulo Automotivo Especializado
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Agenda de Test-Drives & Visitas ao Showroom
        </h1>
        <p className="text-xs text-gray-400">
          Visitas agendadas autonomamente pela IA com confirmação e lembretes automáticos anti no-show.
        </p>
      </div>

      <div className="divide-y divide-[#1e2638] bg-[#111622] rounded-2xl border border-[#1e2638] p-4 shadow-xl">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Nenhum test-drive agendado no momento.
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="py-4 px-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{app.titulo}</h4>
                  <p className="text-[11px] text-gray-400">
                    Cliente: {app.lead.nome} • {app.lead.telefone}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-gray-300 font-semibold">{formatDate(app.dataHorario)}</div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1 inline-block">
                  {app.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
