"use client";

import { useState, useEffect } from "react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Globe,
  MessageSquare,
  PowerOff,
} from "lucide-react";

export default function SettingsInstagramPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(false);
  const [handle, setHandle] = useState("@minhaempresa");
  const [keywords, setKeywords] = useState<string[]>(["QUERO", "DESCONTO", "SIMULAR"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/settings/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data.instagramHandle) setHandle(data.instagramHandle);
        setConnected(Boolean(data.instagramConnected));
        if (data.keywords) setKeywords(data.keywords);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeyword.trim().toUpperCase().replace(/#/g, "");
    if (!clean || keywords.includes(clean)) return;

    const updated = [...keywords, clean];
    setKeywords(updated);
    setNewKeyword("");

    await fetch("/api/settings/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "UPDATE_KEYWORDS", keywords: updated }),
    });
  };

  const handleRemoveKeyword = async (word: string) => {
    const updated = keywords.filter((k) => k !== word);
    setKeywords(updated);

    await fetch("/api/settings/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "UPDATE_KEYWORDS", keywords: updated }),
    });
  };

  const handleToggleConnect = async () => {
    setSaving(true);
    try {
      const action = connected ? "DISCONNECT" : "CONNECT";
      const res = await fetch("/api/settings/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          instagramHandle: handle,
          keywords,
        }),
      });
      if (res.ok) {
        setConnected(!connected);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-gray-500">Carregando módulo do Instagram...</div>;
  }

  const webhookUrl = "http://localhost:3000/api/webhooks/instagram";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <InstagramIcon className="w-5 h-5 text-pink-400" /> Conexão do Instagram Direct
        </h1>
        <p className="text-xs text-gray-400">
          Vincule sua conta profissional do Instagram para a IA responder e qualificar automaticamente mensagens e palavras-chave enviadas no Direct.
        </p>
      </div>

      {/* Status Bar */}
      <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              connected
                ? "bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]"
                : "bg-gray-600"
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              Status da Conexão:{" "}
              <span
                className={`font-mono uppercase ${
                  connected ? "text-pink-400" : "text-gray-400"
                }`}
              >
                {connected ? "Conta Conectada & Monitorando" : "Não Conectada"}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              Conta Vinculada: {handle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleConnect}
          disabled={saving}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md ${
            connected
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white"
          }`}
        >
          {connected ? (
            <>
              <PowerOff className="w-3.5 h-3.5" /> Desconectar Instagram
            </>
          ) : (
            <>
              <InstagramIcon className="w-4 h-4" /> Conectar com Instagram (Meta OAuth)
            </>
          )}
        </button>
      </div>

      {/* Gerenciador de Palavras-Chave de Gatilho */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-6 shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Palavras-Chave de Auto-Resposta (Direct Keywords)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Gatilhos Ativos
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Quando um seguidor mandar qualquer uma dessas palavras no Direct, a IA assumirá instantaneamente a conversa para qualificá-lo no CRM.
          </p>
        </div>

        {/* Input para adicionar nova palavra */}
        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Ex: QUERO, DESCONTO, CONSULTA, TESTDRIVE..."
            className="flex-1 px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 uppercase font-mono"
          />
          <button
            type="submit"
            disabled={!newKeyword.trim()}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Adicionar Gatilho
          </button>
        </form>

        {/* Lista de tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {keywords.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhuma palavra-chave cadastrada.</p>
          ) : (
            keywords.map((kw) => (
              <div
                key={kw}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161d2d] border border-pink-500/30 text-xs font-mono text-pink-300"
              >
                <span>#{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-gray-500 hover:text-red-400 transition"
                  title="Remover palavra"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Webhook do Instagram */}
      <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-3 shadow-xl">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Webhook Oficial do Instagram Graph API
        </h3>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-[#1e2638] text-xs">
          <div className="truncate">
            <span className="text-[10px] text-gray-500 block font-mono">URL de Callback</span>
            <span className="font-mono text-gray-200">{webhookUrl}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(webhookUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1c2438] hover:bg-[#252e42] text-xs text-gray-300 font-mono transition flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
