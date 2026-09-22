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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
    return <div className="p-8 text-xs text-[#7C8472]">Carregando módulo do Instagram...</div>;
  }

  const webhookUrl = "http://localhost:3000/api/webhooks/instagram";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] text-xs font-medium border border-[#D0D5CD] mb-2">
          <InstagramIcon className="w-3.5 h-3.5 text-[#2C2E2A]" /> Canal Social & Atendimento
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Conexão do Instagram Direct
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Vincule sua conta profissional do Instagram para a IA qualificar e responder mensagens e palavras-chave enviadas no Direct.
        </p>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                connected ? "bg-[#2D6A4F] ring-4 ring-[#DDE8DE]" : "bg-[#7C8472]"
              }`}
            />
            <div>
              <div className="text-xs font-bold text-[#2C2E2A] flex items-center gap-2">
                Status da Conexão:{" "}
                <span
                  className={`font-mono uppercase font-bold ${
                    connected ? "text-[#2D6A4F]" : "text-[#7C8472]"
                  }`}
                >
                  {connected ? "Conta Conectada & Monitorando" : "Não Conectada"}
                </span>
              </div>
              <p className="text-[11px] text-[#63695B] font-mono mt-0.5">
                Conta Vinculada: {handle}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={connected ? "secondary" : "primary"}
            onClick={handleToggleConnect}
            disabled={saving}
          >
            {connected ? (
              <>
                <PowerOff className="w-3.5 h-3.5" /> Desconectar Instagram
              </>
            ) : (
              <>
                <InstagramIcon className="w-4 h-4" /> Conectar com Instagram
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Gerenciador de Palavras-Chave de Gatilho */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Palavras-Chave de Auto-Resposta (Direct Keywords)</CardTitle>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] border border-[#C4D7C4] font-bold">
              Gatilhos Ativos ({keywords.length})
            </span>
          </div>
          <CardDescription>
            Quando um seguidor mandar qualquer uma dessas palavras no Direct, a IA assumirá instantaneamente a conversa para qualificá-lo no CRM.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input para adicionar nova palavra */}
          <form onSubmit={handleAddKeyword} className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Ex: QUERO, DESCONTO, CONSULTA, TESTDRIVE..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] uppercase font-mono"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newKeyword.trim()}
            >
              <Plus className="w-4 h-4" /> Adicionar Gatilho
            </Button>
          </form>

          {/* Lista de tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {keywords.length === 0 ? (
              <p className="text-xs text-[#7C8472]">Nenhuma palavra-chave cadastrada.</p>
            ) : (
              keywords.map((kw) => (
                <div
                  key={kw}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs font-mono text-[#2C2E2A] font-medium"
                >
                  <span>#{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-[#7C8472] hover:text-red-600 transition cursor-pointer"
                    title="Remover palavra"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webhook do Instagram */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Oficial do Instagram Graph API</CardTitle>
          <CardDescription>URL de destino para recepção de eventos de mensagens e menções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs">
            <div className="truncate">
              <span className="text-[10px] text-[#7C8472] block font-mono">URL de Callback</span>
              <span className="font-mono text-[#2C2E2A] font-semibold">{webhookUrl}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
