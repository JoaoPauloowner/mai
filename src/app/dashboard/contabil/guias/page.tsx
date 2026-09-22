"use client";

import { useState } from "react";
import { ReceiptText, QrCode, Sparkles, Send, CheckCircle2, Copy, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface GuiaTributaria {
  id: string;
  tipo: "DAS" | "DARF" | "FGTS" | "GPS";
  competencia: string;
  vencimento: string;
  valor: number;
  empresa: string;
  telefone: string;
  pixCopiaECola: string;
  status: "ENVIADO_WHATSAPP" | "VISUALIZADO" | "PAGO_CONFIRMADO";
}

export default function GuiasContabilPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [guias, setGuias] = useState<GuiaTributaria[]>([
    {
      id: "1",
      tipo: "DAS",
      competencia: "08/2026",
      vencimento: "20/09/2026",
      valor: 4320.5,
      empresa: "Restaurante Sabor & Arte Ltda",
      telefone: "+55 (11) 98765-4321",
      pixCopiaECola: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400052040000530398654054320.505802BR5913SimplesNac6008Brasilia",
      status: "PAGO_CONFIRMADO",
    },
    {
      id: "2",
      tipo: "FGTS",
      competencia: "08/2026",
      vencimento: "07/09/2026",
      valor: 1890.0,
      empresa: "Clínica Vida Saudável",
      telefone: "+55 (11) 99123-8877",
      pixCopiaECola: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400152040000530398654051890.005802BR5913FgtsDigital6008Brasilia",
      status: "ENVIADO_WHATSAPP",
    },
    {
      id: "3",
      tipo: "DARF",
      competencia: "08/2026",
      vencimento: "25/09/2026",
      valor: 2650.0,
      empresa: "AutoPrime Motors",
      telefone: "+55 (11) 97654-3210",
      pixCopiaECola: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400252040000530398654052650.005802BR5913ReceitaFed6008Brasilia",
      status: "VISUALIZADO",
    },
  ]);

  const handleCopyPix = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-xs font-bold border border-[#C4D7C4] mb-2">
          <ReceiptText className="w-3.5 h-3.5" /> Módulo Contábil & Fiscal
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Emissão de Guias Tributárias com PIX Copia e Cola
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Disparo automático de DAS, DARF e FGTS pelo WhatsApp com código de barras, PIX instantâneo e régua de lembretes D-3, D-0 e D+1.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Guias Disparadas</div>
          <div className="text-2xl font-serif font-bold text-[#2C2E2A]">{guias.length}</div>
          <p className="text-[11px] text-[#2D6A4F] mt-1">Régua D-3 em andamento</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Volume Tributário</div>
          <div className="text-2xl font-serif font-bold text-[#2D6A4F]">
            R$ {guias.reduce((acc, g) => acc + g.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#63695B] mt-1">Neste fechamento</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E0E3DE] shadow-xs">
          <div className="text-xs text-[#7C8472] uppercase font-mono mb-1">Pagos via PIX Instantâneo</div>
          <div className="text-2xl font-serif font-bold text-[#8F5D18]">68%</div>
          <p className="text-[11px] text-[#63695B] mt-1">Zero juros para o cliente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Painel de Cobrança e Guias Fiscais</CardTitle>
          <CardDescription>Status de visualização e confirmação de pagamento via webhook PIX</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E0E3DE]">
            {guias.map((guia) => (
              <div key={guia.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#2C2E2A] text-white px-2 py-0.5 rounded">
                      {guia.tipo}
                    </span>
                    <span className="font-bold text-sm text-[#2C2E2A]">{guia.empresa}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        guia.status === "PAGO_CONFIRMADO"
                          ? "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"
                          : guia.status === "VISUALIZADO"
                          ? "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]"
                          : "bg-[#E7EBE6] text-[#2C2E2A] border-[#D0D5CD]"
                      }`}
                    >
                      {guia.status === "PAGO_CONFIRMADO"
                        ? "✓ Pago e Baixado"
                        : guia.status === "VISUALIZADO"
                        ? "👀 Visualizado pelo Cliente"
                        : "✉️ Enviado no WhatsApp"}
                    </span>
                  </div>
                  <p className="text-[#63695B] text-xs">
                    Competência: <strong>{guia.competencia}</strong> • Vencimento: <strong>{guia.vencimento}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Valor da Guia</span>
                    <span className="text-base font-bold font-mono text-[#2D6A4F]">
                      R$ {guia.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPix(guia.id, guia.pixCopiaECola)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === guia.id ? "Copiado!" : "Copiar PIX"}
                    </Button>

                    <a
                      href={`https://wa.me/${guia.telefone.replace(/\D/g, "")}?text=Olá! Segue sua guia de ${
                        guia.tipo
                      } (${guia.competencia}) no valor de R$ ${guia.valor.toFixed(
                        2
                      )} com vencimento em ${guia.vencimento}. Pague via PIX Copia e Cola: ${guia.pixCopiaECola}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#C1ED84] text-[#2C2E2A] font-bold text-xs hover:bg-[#B2E372] transition border border-[#A5DC60] inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
