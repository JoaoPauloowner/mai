"use client";

import { useState } from "react";
import { LifeBuoy, Sparkles, MessageSquare, CheckCircle2, User, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ChamadoContabil {
  id: string;
  cliente: string;
  departamento: "FISCAL" | "DEPARTAMENTO_PESSOAL" | "SOCIETARIO" | "CONTABIL";
  assunto: string;
  ultimaMensagem: string;
  tempoEspera: string;
  prioridade: "ALTA" | "MEDIA" | "NORMAL";
  status: "EM_ATENDIMENTO" | "AGUARDANDO_CLIENTE" | "RESOLVIDO";
}

export default function HelpdeskContabilPage() {
  const [chamados, setChamados] = useState<ChamadoContabil[]>([
    {
      id: "1",
      cliente: "Transportadora Rápido Sol Ltda",
      departamento: "DEPARTAMENTO_PESSOAL",
      assunto: "Cálculo de rescisão funcionário motorista",
      ultimaMensagem: "Enviei os comprovantes de horas extras em anexo no WhatsApp.",
      tempoEspera: "8 min",
      prioridade: "ALTA",
      status: "EM_ATENDIMENTO",
    },
    {
      id: "2",
      cliente: "Studio Design e Arquitetura",
      departamento: "FISCAL",
      assunto: "Dúvida sobre retenção de ISS em nota de serviço tomador SP",
      ultimaMensagem: "A prefeitura de SP está cobrando retenção na fonte?",
      tempoEspera: "22 min",
      prioridade: "MEDIA",
      status: "AGUARDANDO_CLIENTE",
    },
    {
      id: "3",
      cliente: "Bar & Gastronomia Gourmet",
      departamento: "SOCIETARIO",
      assunto: "Alteração contratual de sócio administrador",
      ultimaMensagem: "Documentos da JUCESP já foram assinados digitalmente.",
      tempoEspera: "1h",
      prioridade: "NORMAL",
      status: "RESOLVIDO",
    },
  ]);

  const handleResolver = (id: string) => {
    setChamados(
      chamados.map((c) =>
        c.id === id ? { ...c, status: "RESOLVIDO" as const } : c
      )
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-xs font-bold border border-[#C4D7C4] mb-2">
          <LifeBuoy className="w-3.5 h-3.5" /> Módulo Contábil & Fiscal
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Helpdesk Contábil Departamental
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Triagem e roteamento inteligente de solicitações do cliente para os departamentos Fiscal, DP, Societário ou Contábil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-[10px] text-[#7C8472] uppercase font-mono mb-1">Fiscal / Tributário</div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">12 chamados</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">SLA Médio: 18 min</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-[10px] text-[#7C8472] uppercase font-mono mb-1">Dep. Pessoal (DP)</div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">8 chamados</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">Admissões & Rescisões</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-[10px] text-[#7C8472] uppercase font-mono mb-1">Societário / Legal</div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">4 chamados</div>
          <p className="text-[11px] text-[#63695B] mt-1">JUCESP & Alvarás</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-[10px] text-[#7C8472] uppercase font-mono mb-1">Satisfação Clientes</div>
          <div className="text-2xl font-serif font-bold text-[#2D6A4F]">98.4%</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">Avaliações WhatsApp 5★</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fila de Chamados Ativos</CardTitle>
          <CardDescription>Roteamento por intenção detectada pela IA no WhatsApp</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E0E3DE]">
            {chamados.map((c) => (
              <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-[#E7EBE6] text-[#2C2E2A] px-2 py-0.5 rounded border border-[#D0D5CD]">
                      {c.departamento}
                    </span>
                    <span className="font-bold text-sm text-[#2C2E2A]">{c.cliente}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        c.status === "RESOLVIDO"
                          ? "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"
                          : c.status === "EM_ATENDIMENTO"
                          ? "bg-[#C1ED84] text-[#2C2E2A] border-[#A5DC60]"
                          : "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]"
                      }`}
                    >
                      {c.status === "RESOLVIDO" ? "✓ Resolvido" : c.status === "EM_ATENDIMENTO" ? "Em Atendimento" : "Aguardando"}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#2C2E2A]">{c.assunto}</p>
                  <p className="text-[#63695B] text-xs italic">&ldquo;{c.ultimaMensagem}&rdquo;</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Tempo na Fila</span>
                    <span className="font-mono font-bold text-[#2C2E2A]">{c.tempoEspera}</span>
                  </div>

                  {c.status !== "RESOLVIDO" && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolver(c.id)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluir Chamado
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
