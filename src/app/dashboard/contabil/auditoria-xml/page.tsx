"use client";

import { useState } from "react";
import { FileText, Sparkles, CheckCircle2, Upload, AlertCircle, FileCheck2, ReceiptText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface XmlAuditResult {
  id: string;
  chaveNfe: string;
  emitente: string;
  destinatario: string;
  valorTotal: number;
  icms: number;
  pisCofins: number;
  status: "CONCILIADO" | "PENDENTE_COMPROVANTE" | "DIVERGENCIA_ALIQUOTA";
}

export default function AuditoriaXmlPage() {
  const [processing, setProcessing] = useState(false);
  const [xmlList, setXmlList] = useState<XmlAuditResult[]>([
    {
      id: "1",
      chaveNfe: "35230912345678000190550010000012341000012345",
      emitente: "Distribuidora Paulista Ltda",
      destinatario: "AutoPrime Motors",
      valorTotal: 14500.0,
      icms: 2610.0,
      pisCofins: 1341.25,
      status: "CONCILIADO",
    },
    {
      id: "2",
      chaveNfe: "35230998765432000188550010000098761000098765",
      emitente: "Tech Informática e Serviços Eireli",
      destinatario: "AutoPrime Motors",
      valorTotal: 3200.0,
      icms: 0.0,
      pisCofins: 296.0,
      status: "PENDENTE_COMPROVANTE",
    },
  ]);

  const handleSimularUpload = () => {
    setProcessing(true);
    setTimeout(() => {
      const novo: XmlAuditResult = {
        id: Date.now().toString(),
        chaveNfe: "352409" + Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString(),
        emitente: "Fornecedor Peças Brasil Ltda",
        destinatario: "AutoPrime Motors",
        valorTotal: 8900.0,
        icms: 1602.0,
        pisCofins: 823.25,
        status: "CONCILIADO",
      };
      setXmlList([novo, ...xmlList]);
      setProcessing(false);
      alert("XML de NF-e auditado e conciliado com sucesso!");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF7EF] text-[#247A4A] text-xs font-bold border border-[#C8E5D1] mb-2">
          <ReceiptText className="w-3.5 h-3.5" /> Módulo Contábil & Fiscal
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
          Auditoria & Conciliação de XMLs de NF-e
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-1">
          Recepção de notas fiscais e comprovantes bancários via WhatsApp com validação de CFOP, retenções tributárias e conciliação contábil prévia.
        </p>
      </div>

      {/* Dropzone Simulator */}
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF7EF] text-[#247A4A] border border-[#C8E5D1] mx-auto flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#171717]">Importar Lote de XMLs ou DANFEs em PDF</h3>
            <p className="text-xs text-[#6F6F6F] max-w-md mx-auto mt-1">
              Os arquivos enviados pelos clientes no WhatsApp são importados automaticamente, mas você também pode processar arquivos locais.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={handleSimularUpload}
            disabled={processing}
          >
            <FileText className="w-4 h-4" />
            {processing ? "Auditando Alíquotas e CFOP..." : "Processar e Auditar Novo XML"}
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de XMLs */}
      <Card>
        <CardHeader>
          <CardTitle>NF-e Auditadas no Período ({xmlList.length})</CardTitle>
          <CardDescription>Conferência tributária automatizada com conferência de impostos retidos</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E7E7E4]">
            {xmlList.map((xml) => (
              <div key={xml.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171717]">{xml.emitente}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        xml.status === "CONCILIADO"
                          ? "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]"
                          : "bg-[#FFF3D6] text-[#A15C00] border-[#E8D5A8]"
                      }`}
                    >
                      {xml.status === "CONCILIADO" ? "✓ Conciliado" : "⚠️ Pendente Comprovante"}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#8A8A84] truncate max-w-md">
                    Chave: {xml.chaveNfe}
                  </p>
                  <p className="text-[11px] text-[#6F6F6F]">
                    ICMS: <strong>R$ {xml.icms.toFixed(2)}</strong> • PIS/COFINS: <strong>R$ {xml.pisCofins.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#8A8A84] uppercase font-mono block">Valor Total da Nota</span>
                  <span className="text-base font-bold font-mono text-[#171717]">
                    R$ {xml.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
