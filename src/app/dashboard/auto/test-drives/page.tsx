import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Car, Clock, User, Phone, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3D6] text-[#A15C00] text-xs font-bold border border-[#E8D5A8] mb-2">
          <Car className="w-3.5 h-3.5" /> Módulo Automotivo Especializado
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
          Agenda de Test-Drives & Visitas ao Showroom
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-1">
          Visitas agendadas autonomamente pela IA com confirmação e lembretes automáticos anti no-show.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Agendamentos de Test-Drive ({appointments.length})</CardTitle>
            <CardDescription>Clientes aguardando recepção e atendimento no pátio</CardDescription>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#EAF7EF] text-[#247A4A] border border-[#C8E5D1] font-bold">
            Confirmação Automática WhatsApp Ativa
          </span>
        </CardHeader>

        <CardContent>
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A8A84]">
              Nenhum test-drive agendado no momento. Conforme os leads forem agendados pela IA no WhatsApp, aparecerão nesta lista.
            </div>
          ) : (
            <div className="divide-y divide-[#E7E7E4]">
              {appointments.map((app: any) => (
                <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF3D6] text-[#A15C00] border border-[#E8D5A8] flex items-center justify-center font-bold">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#171717] text-sm">{app.titulo}</h4>
                      <p className="text-xs text-[#6F6F6F] flex items-center gap-2 mt-0.5">
                        <span>Cliente: <strong>{app.lead.nome}</strong></span>
                        <span>•</span>
                        <span className="font-mono">{app.lead.telefone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-[#171717] font-bold">{formatDate(app.dataHorario)}</div>
                      <span className="text-[10px] font-mono font-bold text-[#247A4A] bg-[#EAF7EF] px-2 py-0.5 rounded-full border border-[#C8E5D1] mt-1 inline-block">
                        {app.status}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${app.lead.telefone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                        app.lead.nome
                      )}! Confirmamos seu Test-Drive para ${formatDate(app.dataHorario)}. Estamos te aguardando!`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#FF6A2A] text-[#171717] font-bold text-xs hover:bg-[#EB5417] transition border border-[#A5DC60]"
                    >
                      Lembrete
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
