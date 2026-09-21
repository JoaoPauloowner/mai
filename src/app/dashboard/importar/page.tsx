"use client";

import { useState } from "react";
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

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
      // Parse CSV simples
      const lines = csvText.trim().split("\n");
      if (lines.length <= 1) {
        throw new Error("Insira ao menos um registro abaixo do cabeçalho");
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
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
        <h1 className="text-xl font-bold tracking-tight text-white">
          Importador de Leads (CSV / Excel)
        </h1>
        <p className="text-xs text-gray-400">
          Carregamento em lote com normalização automática E.164 (+55...) e deduplicação instantânea via SHA-256.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-5 shadow-xl">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-gray-300">
          <Sparkles className="w-5 h-5 text-[#00ddd7] shrink-0" />
          <div>
            <strong className="text-white block">LGPD & Proteção Contra Duplicidades:</strong>
            Números repetidos são automaticamente detectados pelo hash e descartados para evitar disparos em dobro aos clientes.
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Importação concluída com sucesso!
            </div>
            <div className="text-gray-300 text-[11px] font-mono">
              Total recebido: {result.totalRecebido} • Novos leads inseridos: {result.inseridos} • Duplicados prevenidos: {result.duplicados}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Cole os dados no formato CSV (ou edite o exemplo abaixo):
          </label>
          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3.5 bg-[#0a0d14] border border-[#252e42] rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-[#00ddd7] transition"
          />
        </div>

        <button
          type="button"
          onClick={handleImport}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Processando dados..."
          ) : (
            <>
              <Upload className="w-4 h-4" /> Processar e Importar Leads
            </>
          )}
        </button>
      </div>
    </div>
  );
}
