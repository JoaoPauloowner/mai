"use client";

import { useState } from "react";
import { Scale, Sparkles, ShieldCheck, CheckCircle2, Send, Download, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface SeguradoraCotacao {
  seguradora: string;
  premioTotal: number;
  franquia: number;
  danosMateriais: number;
  carroReserva: string;
  comissaoCorretor: number;
  destaque: boolean;
}

export default function CotacoesSegurosPage() {
  const [veiculo, setVeiculo] = useState("Toyota Corolla Cross 2.0 (2023)");
  const [segurado, setSegurado] = useState("Rafael Vasconcelos");
  const [telefone, setTelefone] = useState("+55 (11) 98123-4567");

  const [cotacoes, setCotacoes] = useState<SeguradoraCotacao[]>([
    {
      seguradora: "Porto Seguro Auto",
      premioTotal: 3450.0,
      franquia: 2800.0,
      danosMateriais: 200000.0,
      carroReserva: "15 dias ilimitado",
      comissaoCorretor: 517.5,
      destaque: true,
    },
    {
      seguradora: "Allianz Seguros",
      premioTotal: 3190.0,
      franquia: 3200.0,
      danosMateriais: 150000.0,
      carroReserva: "7 dias",
      comissaoCorretor: 478.5,
      destaque: false,
    },
    {
      seguradora: "Bradesco Seguros",
      premioTotal: 3620.0,
      franquia: 2500.0,
      danosMateriais: 250000.0,
      carroReserva: "30 dias",
      comissaoCorretor: 543.0,
      destaque: false,
    },
    {
      seguradora: "Tokio Marine",
      premioTotal: 2980.0,
      franquia: 3400.0,
      danosMateriais: 100000.0,
      carroReserva: "7 dias básico",
      comissaoCorretor: 447.0,
      destaque: false,
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-xs font-bold border border-[#C4D7C4] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Módulo Corretora de Seguros
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Multicálculo & Comparativo de Seguradoras
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Matriz comparativa de prêmio, franquia e comissões entre Porto Seguro, Allianz, Bradesco, Tokio Marine e HDI com envio de resumo por WhatsApp.
        </p>
      </div>

      {/* Dados da Cotação em Análise */}
      <Card>
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Cotação Ativa</span>
            <h3 className="font-serif font-bold text-base text-[#2C2E2A]">{veiculo}</h3>
            <p className="text-xs text-[#63695B]">
              Segurado: <strong>{segurado}</strong> • {telefone}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${telefone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                segurado
              )}! Segue o comparativo das melhores propostas para o seu ${encodeURIComponent(
                veiculo
              )}:%0A%0A1) Porto Seguro: R$ 3.450 em 10x sem juros (Franquia R$ 2.800)%0A2) Allianz: R$ 3.190 em 10x sem juros (Franquia R$ 3.200)%0A3) Tokio Marine: R$ 2.980 em 10x sem juros%0A%0AQual opção prefere fechar?`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#C1ED84] text-[#2C2E2A] font-bold text-xs hover:bg-[#B2E372] transition border border-[#A5DC60] inline-flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" /> Enviar Comparativo no WhatsApp
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Matriz Comparativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cotacoes.map((c, i) => (
          <Card key={i} className={c.destaque ? "ring-2 ring-[#7A8E75]" : ""}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{c.seguradora}</CardTitle>
                <CardDescription>Cobertura Compreensiva 100% FIPE</CardDescription>
              </div>
              {c.destaque && (
                <span className="text-[10px] font-mono font-bold bg-[#C1ED84] text-[#2C2E2A] px-2.5 py-1 rounded-full border border-[#A5DC60]">
                  Melhor Custo-Benefício
                </span>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE]">
                <span className="text-xs text-[#63695B] font-medium">Prêmio Anual:</span>
                <span className="font-serif font-bold text-xl text-[#2C2E2A]">
                  R$ {c.premioTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  <span className="text-[11px] font-sans font-normal text-[#7C8472] ml-1">(10x s/ juros)</span>
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-[#E0E3DE]">
                <div className="flex justify-between pt-1">
                  <span className="text-[#63695B]">Franquia Reduzida:</span>
                  <span className="font-mono font-bold text-[#2C2E2A]">
                    R$ {c.franquia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#63695B]">Danos Materiais a Terceiros:</span>
                  <span className="font-mono font-bold text-[#2C2E2A]">
                    R$ {c.danosMateriais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#63695B]">Carro Reserva:</span>
                  <span className="font-bold text-[#2D6A4F]">{c.carroReserva}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#63695B]">Comissão Estimada (15%):</span>
                  <span className="font-mono font-bold text-[#8F5D18]">
                    R$ {c.comissaoCorretor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
