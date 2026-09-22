"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, Clock, AlertTriangle, Send, PhoneCall, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ApoliceRenovacao {
  id: string;
  segurado: string;
  telefone: string;
  veiculoRisco: string;
  seguradoraAtual: string;
  diasParaVencer: number;
  premioAnterior: number;
  status: "D_30_ENVIADO" | "D_7_URGENTE" | "RENOVADO";
}

export default function RadarRenovacoesPage() {
  const [apolices, setApolices] = useState<ApoliceRenovacao[]>([
    {
      id: "1",
      segurado: "Guilherme Siqueira",
      telefone: "+55 (11) 98765-1122",
      veiculoRisco: "BMW 320i M Sport 2022",
      seguradoraAtual: "Porto Seguro",
      diasParaVencer: 6,
      premioAnterior: 5400.0,
      status: "D_7_URGENTE",
    },
    {
      id: "2",
      segurado: "Carla Pimentel",
      telefone: "+55 (11) 99122-3344",
      veiculoRisco: "Jeep Compass Limited 2021",
      seguradoraAtual: "Allianz Seguros",
      diasParaVencer: 14,
      premioAnterior: 3850.0,
      status: "D_30_ENVIADO",
    },
    {
      id: "3",
      segurado: "Fábio Vasconcelos",
      telefone: "+55 (11) 97788-9900",
      veiculoRisco: "Toyota Hilux SRX 2023",
      seguradoraAtual: "Bradesco Seguros",
      diasParaVencer: 28,
      premioAnterior: 7900.0,
      status: "D_30_ENVIADO",
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-xs font-bold border border-[#C4D7C4] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Módulo Corretora de Seguros
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Radar Preditivo de Renovações de Apólices
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Monitoramento automático de apólices com régua de contato inteligente (D-30, D-15, D-7) via WhatsApp e ligação por voz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="flex items-center justify-between text-[#7C8472] text-xs mb-2">
            <span>Vencendo em 30 Dias</span>
            <Clock className="w-4 h-4 text-[#7A8E75]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">24 apólices</div>
          <p className="text-[11px] text-[#63695B] mt-1">Disparos de aviso programados</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="flex items-center justify-between text-[#7C8472] text-xs mb-2">
            <span>Urgência: Vencendo em 7 Dias</span>
            <AlertTriangle className="w-4 h-4 text-[#8F5D18]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#8F5D18]">8 apólices</div>
          <p className="text-[11px] text-[#63695B] mt-1">Acionamento prioritário da corretora</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="flex items-center justify-between text-[#7C8472] text-xs mb-2">
            <span>Taxa de Retenção de Carteira</span>
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#2D6A4F]">94.2%</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">Zero perdas por esquecimento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apólices na Janela de Renovação</CardTitle>
          <CardDescription>Rastreamento contínuo de vencimentos com acionamento multicanal</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E0E3DE]">
            {apolices.map((ap) => (
              <div key={ap.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2C2E2A]">{ap.segurado}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        ap.diasParaVencer <= 7
                          ? "bg-[#E9BEC4] text-[#9B2226] border-red-200"
                          : "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]"
                      }`}
                    >
                      {ap.diasParaVencer <= 7
                        ? `🚨 Vence em ${ap.diasParaVencer} dias`
                        : `Vence em ${ap.diasParaVencer} dias`}
                    </span>
                  </div>
                  <p className="text-xs text-[#63695B]">
                    Risco: <strong>{ap.veiculoRisco}</strong> • Cia Atual: <strong>{ap.seguradoraAtual}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Prêmio Base Anterior</span>
                    <span className="font-mono font-bold text-[#2C2E2A]">
                      R$ {ap.premioAnterior.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${ap.telefone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                      ap.segurado
                    )}! Sua apólice da ${encodeURIComponent(
                      ap.seguradoraAtual
                    )} para o ${encodeURIComponent(
                      ap.veiculoRisco
                    )} vence em ${ap.diasParaVencer} dias. Já preparamos sua cotação de renovação com o desconto de classe de bônus!` }
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#C1ED84] text-[#2C2E2A] font-bold text-xs hover:bg-[#B2E372] transition border border-[#A5DC60] inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Lembrete WhatsApp
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
