"use client";

import { useState, useEffect } from "react";
import {
  QrCode,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PowerOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";

export default function SettingsWhatsappPage() {
  const [tab, setTab] = useState<"QR_CODE" | "META_CLOUD_API">("QR_CODE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const [status, setStatus] = useState<"CONNECTED" | "DISCONNECTED" | "CONNECTING">("DISCONNECTED");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Meta Cloud API inputs
  const [metaPhoneNumberId, setMetaPhoneNumberId] = useState("");
  const [metaWabaId, setMetaWabaId] = useState("");
  const [metaAccessToken, setMetaAccessToken] = useState("");

  const [webhookUrl, setWebhookUrl] = useState("");
  const [verifyToken, setVerifyToken] = useState("");

  useEffect(() => {
    fetch("/api/settings/whatsapp")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setStatus(data.config.whatsappStatus || "DISCONNECTED");
          setTab((data.config.whatsappTipoConexao as any) || "QR_CODE");
          setWhatsappNumber(data.config.whatsappNumber || "");
          setMetaPhoneNumberId(data.config.metaPhoneNumberId || "");
          setMetaWabaId(data.config.metaWabaId || "");
          setMetaAccessToken(data.config.metaAccessToken || "");
        }
        if (data.webhookUrl) setWebhookUrl(data.webhookUrl);
        if (data.verifyToken) setVerifyToken(data.verifyToken);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 3000);
  };

  const handleSimulateQrPair = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CONNECT_QR",
          whatsappNumber: whatsappNumber || "+5511999990001",
        }),
      });
      if (res.ok) {
        setStatus("CONNECTED");
        setWhatsappNumber(whatsappNumber || "+5511999990001");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE_META",
          metaPhoneNumberId,
          metaWabaId,
          metaAccessToken,
          whatsappNumber,
        }),
      });
      if (res.ok) {
        setStatus("CONNECTED");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DISCONNECT" }),
      });
      if (res.ok) {
        setStatus("DISCONNECTED");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-[#7C8472]">Carregando módulo de WhatsApp...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#2C2E2A]">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#2C2E2A]">
          Conexão do WhatsApp Comercial
        </h1>
        <p className="text-xs text-[#63695B] mt-0.5">
          Escolha como conectar o número da sua empresa: via escaneamento de QR Code (Web) ou via API Oficial da Meta (Cloud API).
        </p>
      </div>

      {/* Status Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} size="md" />
          <div>
            <div className="text-xs font-bold text-[#2C2E2A]">
              Sessão WhatsApp: {status === "CONNECTED" ? "Operação Ativa" : "Aguardando Conexão"}
            </div>
            {status === "CONNECTED" && whatsappNumber && (
              <p className="text-[11px] text-[#63695B] font-mono mt-0.5">
                Número Vinculado: {whatsappNumber}
              </p>
            )}
          </div>
        </div>

        {status === "CONNECTED" && (
          <Button variant="danger" size="sm" onClick={handleDisconnect} disabled={saving}>
            <PowerOff className="w-3.5 h-3.5" />
            <span>Desconectar Número</span>
          </Button>
        )}
      </div>

      {/* Seletor de Modo / Abas */}
      <div className="flex gap-2 p-1 bg-[#E7EBE6] border border-[#D0D5CD] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setTab("QR_CODE")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            tab === "QR_CODE"
              ? "bg-white text-[#2C2E2A] shadow-xs"
              : "text-[#63695B] hover:text-[#2C2E2A]"
          }`}
        >
          <QrCode className="w-4 h-4 text-[#7A8E75]" /> Opção 1: Conexão QR Code (Evolution API v2)
        </button>

        <button
          type="button"
          onClick={() => setTab("META_CLOUD_API")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            tab === "META_CLOUD_API"
              ? "bg-white text-[#2C2E2A] shadow-xs"
              : "text-[#63695B] hover:text-[#2C2E2A]"
          }`}
        >
          <Globe className="w-4 h-4 text-[#7A8E75]" /> Opção 2: Meta Cloud API Oficial (Embedded)
        </button>
      </div>

      {/* Conteúdo Aba 1: QR Code */}
      {tab === "QR_CODE" && (
        <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-[#2C2E2A]">Escanear com o Celular</h3>
            <p className="text-xs text-[#63695B] mt-0.5">
              Abra o WhatsApp no seu smartphone &gt; Aparelhos Conectados &gt; Conectar um Aparelho.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
            {/* Box do QR Code */}
            <div className="w-56 h-56 rounded-2xl bg-[#F5F5F5] border border-[#E0E3DE] p-3 flex flex-col items-center justify-center shadow-xs relative overflow-hidden">
              {status === "CONNECTED" ? (
                <div className="text-center p-4">
                  <CheckCircle2 className="w-14 h-14 text-[#2D6A4F] mx-auto mb-2" />
                  <span className="text-xs font-bold text-[#2C2E2A] block">WhatsApp Conectado!</span>
                  <span className="text-[10px] text-[#63695B]">Sessão ativa e sincronizada</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-44 h-44 bg-white border border-[#E0E3DE] rounded-xl flex items-center justify-center text-[#2C2E2A] p-3 font-mono text-[9px] relative shadow-2xs">
                    <QrCode className="w-28 h-28 text-[#2C2E2A]" />
                  </div>
                </div>
              )}
            </div>

            {/* Ações e Instruções */}
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2 text-xs text-[#2C2E2A]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Abra o WhatsApp no smartphone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Toque em <strong>Aparelhos conectados</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Aponte a câmera para esta tela</span>
                </div>
              </div>

              {status !== "CONNECTED" && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleSimulateQrPair}
                  disabled={saving}
                >
                  <RefreshCw className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
                  <span>{saving ? "Pareando com WhatsApp..." : "Conectar / Simular Pareamento QR"}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Meta Cloud API */}
      {tab === "META_CLOUD_API" && (
        <form onSubmit={handleSaveMeta} className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E3DE]">
            <div>
              <h3 className="text-sm font-bold text-[#2C2E2A] flex items-center gap-2">
                <span>Meta Cloud API & Embedded Signup</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DDE8DE] text-[#2D6A4F] border border-[#C4D7C4] font-bold">
                  Oficial Meta
                </span>
              </h3>
              <p className="text-xs text-[#63695B] mt-0.5">
                Sem risco de banimento de chip e homologado para grandes volumes de mensagens.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => alert("Fluxo Embedded Signup acionado!")}
            >
              <Globe className="w-4 h-4 text-[#7A8E75]" />
              <span>Conectar com Facebook</span>
            </Button>
          </div>

          {/* Dados do Webhook */}
          <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-3">
            <div className="text-xs font-bold text-[#2C2E2A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7A8E75]" /> Configuração do Webhook no Meta for Developers:
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E0E3DE]">
                <div className="truncate">
                  <span className="text-[10px] text-[#7C8472] uppercase font-mono block">URL de Retorno de Chamada</span>
                  <span className="font-mono text-[#2C2E2A]">{webhookUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(webhookUrl, "url")}
                  className="px-2.5 py-1 rounded bg-[#E7EBE6] hover:bg-[#D0D5CD] text-[10px] text-[#2C2E2A] font-mono transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedField === "url" ? "Copiado!" : "Copiar"}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E0E3DE]">
                <div>
                  <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Token de Verificação</span>
                  <span className="font-mono text-[#2C2E2A]">{verifyToken}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(verifyToken, "token")}
                  className="px-2.5 py-1 rounded bg-[#E7EBE6] hover:bg-[#D0D5CD] text-[10px] text-[#2C2E2A] font-mono transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedField === "token" ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>

          {/* Campos Manuais */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Phone Number ID (ID do Telefone)</label>
              <input
                type="text"
                value={metaPhoneNumberId}
                onChange={(e) => setMetaPhoneNumberId(e.target.value)}
                placeholder="Ex: 104928172938472"
                className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1">WABA ID (WhatsApp Business Account ID)</label>
              <input
                type="text"
                value={metaWabaId}
                onChange={(e) => setMetaWabaId(e.target.value)}
                placeholder="Ex: 982736451928374"
                className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Token de Acesso Permanente</label>
              <input
                type="password"
                value={metaAccessToken}
                onChange={(e) => setMetaAccessToken(e.target.value)}
                placeholder="EAAGm0PX4ZC9..."
                className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E0E3DE] flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Credenciais da Meta API"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
