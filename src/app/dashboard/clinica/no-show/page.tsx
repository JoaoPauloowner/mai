"use client";

import { useState } from "react";
import { ClockAlert, Sparkles, UserX, ShieldCheck, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NoShowClinicaPage() {
  const [disparado, setDisparado] = useState(false);

  const [pacientesPendentes, setPacientesPendentes] = useState([
    {
      id: "1",
      nome: "Juliana Medeiros",
      telefone: "+55 (11) 98765-4321",
      horario: "Amanhã às 09:30",
      procedimento: "Consulta Dermatologia",
      status: "AGUARDANDO_RESPOSTA",
    },
    {
      id: "2",
      nome: "Ricardo Silveira",
      telefone: "+55 (11) 97711-2233",
      horario: "Amanhã às 11:00",
      procedimento: "Avaliação Odontológica",
      status: "AGUARDANDO_RESPOSTA",
    },
    {
      id: "3",
      nome: "Clara Zanetti",
      telefone: "+55 (11) 96655-4433",
      horario: "Amanhã às 14:00",
      procedimento: "Retorno Clínico",
      status: "CONFIRMADO_WHATSAPP",
    },
  ]);

  const handleDispararLembretes = () => {
    setDisparado(true);
    setTimeout(() => {
      setDisparado(false);
      alert("Lembretes interativos 24h disparados com sucesso pelo WhatsApp!");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9BEC4] text-[#9B2226] text-xs font-bold border border-red-200 mb-2">
            <ClockAlert className="w-3.5 h-3.5" /> Módulo Clínicas & Saúde
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
            Painel de Prevenção de Faltas (Anti No-Show)
          </h1>
          <p className="text-xs text-[#63695B] mt-1">
            Régua ativa de confirmação com envio de botões interativos (&ldquo;Confirmar&rdquo; / &ldquo;Remarcar&rdquo;) 24h e 2h antes da consulta.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleDispararLembretes}
          disabled={disparado}
        >
          <Send className="w-4 h-4" />
          {disparado ? "Disparando..." : "Disparar Régua 24h Agora"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Faltas Prevenidas</div>
          <div className="text-2xl font-serif font-bold text-[#2D6A4F]">34 consultas</div>
          <p className="text-[11px] text-[#63695B] mt-1">Neste mês corrente</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Índice de No-Show</div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">4.8%</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">Redução de 28% para menos de 5%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Receita Preservada</div>
          <div className="text-2xl font-serif font-bold text-[#8F5D18]">R$ 11.900</div>
          <p className="text-[11px] text-[#63695B] mt-1">Gabinete médico ocupado</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fila de Confirmação Automática das Próximas 24 Horas</CardTitle>
          <CardDescription>Pacientes sendo monitorados pela IA para confirmação de presença</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E0E3DE]">
            {pacientesPendentes.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2C2E2A]">{p.nome}</span>
                    <span className="font-mono text-[#63695B] text-[11px]">({p.telefone})</span>
                  </div>
                  <p className="text-xs text-[#63695B]">
                    {p.procedimento} • <strong>{p.horario}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      p.status === "CONFIRMADO_WHATSAPP"
                        ? "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"
                        : "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]"
                    }`}
                  >
                    {p.status === "CONFIRMADO_WHATSAPP" ? "✓ Confirmado via WhatsApp" : "⏳ Aguardando Resposta"}
                  </span>

                  <a
                    href={`https://wa.me/${p.telefone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                      p.nome
                    )}! Você confirma sua presença para a ${encodeURIComponent(p.procedimento)} (${encodeURIComponent(
                      p.horario
                    )})? Digite 1 para Confirmar ou 2 para Remarcar.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#C1ED84] text-[#2C2E2A] font-bold text-xs hover:bg-[#B2E372] transition border border-[#A5DC60]"
                  >
                    Reenviar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
