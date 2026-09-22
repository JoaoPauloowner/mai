"use client";

import { useState } from "react";
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ImportarPage() {
  const [csvText, setCsvText] = useState(
    `Nome,Telefone,Email,Interesse\nLucas Ferreira,(11) 98765-4321,lucas@exemplo.com,Interesse em Financiamento\nBeatriz Ramos,11998877665,beatriz@exemplo.com,Cotação de Seguro Auto\nCarlos Andrade,+55 11 91234-5678,carlos@exemplo.com,Consultoria Fiscal`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    totalRecebido: number;
    inseridos: number;
    duplicados: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleImport = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const lines = csvText.trim().split("\n");
      if (lines.length <= 1) {
        throw new Error("Insira ao menos um registro abaixo do cabeçalho");
      }

      const leads = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((c) => c.trim());
        if (row.length >= 2) {
          leads.push({
            nome: row[0] || "Sem Nome",
            telefone: row[1] || "",
            email: row[2] || "",
            ramoInteresse: row[3] || "Geral",
          });
        }
      }

      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na importação");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] text-xs font-medium border border-[#D0D5CD] mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#7A8E75]" /> Carga de Base & Higienização
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Importador de Leads (CSV / Excel)
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Carregamento em lote com normalização automática E.164 (+55...) e deduplicação instantânea via hash criptográfico.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entrada de Dados em Lote</CardTitle>
          <CardDescription>
            Cole suas linhas de CSV com Nome, Telefone, Email e Interesse.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#DDE8DE] border border-[#C4D7C4] text-xs text-[#2D6A4F]">
            <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0" />
            <div>
              <strong className="text-[#2C2E2A] block">LGPD & Proteção Contra Duplicidades:</strong>
              Números repetidos são automaticamente detectados e descartados para evitar disparos em dobro aos clientes.
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#E9BEC4] border border-[#C4D7C4] text-[#9B2226] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl bg-[#DDE8DE] border border-[#C4D7C4] text-[#2D6A4F] text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Importação concluída com sucesso!
              </div>
              <div className="text-[#2C2E2A] text-[11px] font-mono">
                Total recebido: {result.totalRecebido} • Novos leads inseridos: {result.inseridos} • Duplicados prevenidos: {result.duplicados}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2C2E2A] mb-2">
              Cole os dados no formato CSV (ou edite o exemplo abaixo):
            </label>
            <textarea
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl font-mono text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] transition"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleImport}
            disabled={loading}
          >
            <Upload className="w-4 h-4" />
            {loading ? "Processando dados..." : "Processar e Importar Leads"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
