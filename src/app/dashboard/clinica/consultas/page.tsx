import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Stethoscope, Calendar, Clock, User, Phone, CheckCircle2, HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ConsultasClinicaPage() {
  const session = await requireAuth();

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: session.organizationId,
      tipo: { in: ["CONSULTA", "PROCEDIMENTO", "TEST_DRIVE"] },
    },
    include: { lead: true },
    orderBy: { dataHorario: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDE8E8] text-[#B42318] text-xs font-bold border border-red-200 mb-2">
          <HeartPulse className="w-3.5 h-3.5" /> Módulo Clínicas & Saúde
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
          Agenda de Consultas & Procedimentos Clínicos
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-1">
          Agendamento automatizado de consultas médicas e odontológicas com pré-anamnese e confirmação via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E7E7E4] shadow-xs">
          <div className="text-xs text-[#8A8A84] uppercase font-mono mb-1">Consultas Hoje</div>
          <div className="text-2xl font-serif font-bold text-[#171717]">{appointments.length}</div>
          <p className="text-[11px] text-[#247A4A] mt-1">100% dos pacientes notificados</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E7E7E4] shadow-xs">
          <div className="text-xs text-[#8A8A84] uppercase font-mono mb-1">Taxa de Confirmação</div>
          <div className="text-2xl font-serif font-bold text-[#247A4A]">94.2%</div>
          <p className="text-[11px] text-[#6F6F6F] mt-1">Via botões interativos WhatsApp</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E7E7E4] shadow-xs">
          <div className="text-xs text-[#8A8A84] uppercase font-mono mb-1">Encaixes Automáticos</div>
          <div className="text-2xl font-serif font-bold text-[#A15C00]">3 pacientes</div>
          <p className="text-[11px] text-[#6F6F6F] mt-1">Fila de espera reocupada</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pacientes Agendados ({appointments.length})</CardTitle>
            <CardDescription>Grade médica integrada com status de confirmação em tempo real</CardDescription>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#EAF7EF] text-[#247A4A] border border-[#C8E5D1] font-bold">
            Régua 24h & 2h Ativa
          </span>
        </CardHeader>

        <CardContent>
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A8A84]">
              Nenhuma consulta agendada para este período. Os agendamentos realizados pela IA aparecerão aqui instantaneamente.
            </div>
          ) : (
            <div className="divide-y divide-[#E7E7E4]">
              {appointments.map((app) => (
                <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FDE8E8] text-[#B42318] border border-red-200 flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#171717] text-sm">{app.titulo}</h4>
                      <p className="text-xs text-[#6F6F6F] flex items-center gap-2 mt-0.5">
                        <span>Paciente: <strong>{app.lead.nome}</strong></span>
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
                      )}! Lembramos da sua consulta marcada para ${formatDate(app.dataHorario)}. Por favor, confirme se comparecerá.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#FF6A2A] text-[#171717] font-bold text-xs hover:bg-[#EB5417] transition border border-[#A5DC60]"
                    >
                      Enviar Lembrete
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
