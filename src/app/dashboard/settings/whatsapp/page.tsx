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
    return <div className="p-8 text-xs text-gray-500">Carregando módulo de WhatsApp...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Conexão do WhatsApp Comercial
        </h1>
        <p className="text-xs text-gray-400">
          Escolha como conectar o número da sua empresa: via escaneamento de QR Code (Web) ou via API Oficial da Meta (Cloud API).
        </p>
      </div>

      {/* Status Bar */}
      <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              status === "CONNECTED"
                ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                : "bg-red-400"
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              Status da Conexão:{" "}
              <span
                className={`font-mono uppercase ${
                  status === "CONNECTED" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {status === "CONNECTED" ? "Conectado & Operante" : "Desconectado"}
              </span>
            </div>
            {status === "CONNECTED" && whatsappNumber && (
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                Número Vinculado: {whatsappNumber}
              </p>
            )}
          </div>
        </div>

        {status === "CONNECTED" && (
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition flex items-center gap-2"
          >
            <PowerOff className="w-3.5 h-3.5" /> Desconectar Número
          </button>
        )}
      </div>

      {/* Seletor de Modo / Abas */}
      <div className="flex gap-2 p-1 bg-[#0c101a] border border-[#1e2638] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setTab("QR_CODE")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            tab === "QR_CODE"
              ? "bg-[#1c2438] text-[#00ddd7] border border-[#2e3b54]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <QrCode className="w-4 h-4" /> Opção 1: Conexão QR Code (Evolution API v2)
        </button>

        <button
          type="button"
          onClick={() => setTab("META_CLOUD_API")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            tab === "META_CLOUD_API"
              ? "bg-[#1c2438] text-blue-400 border border-[#2e3b54]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" /> Opção 2: Meta Cloud API Oficial (Embedded)
        </button>
      </div>

      {/* Conteúdo Aba 1: QR Code */}
      {tab === "QR_CODE" && (
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-6 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white">Escanear com o Celular</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Abra o WhatsApp no seu celular &gt; Aparelhos Conectados &gt; Conectar um Aparelho.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
            {/* Box do QR Code */}
            <div className="w-56 h-56 rounded-2xl bg-white p-3 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              {status === "CONNECTED" ? (
                <div className="text-center p-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-2" />
                  <span className="text-xs font-bold text-gray-800 block">WhatsApp Conectado!</span>
                  <span className="text-[10px] text-gray-500">Sessão ativa e sincronizada</span>
                </div>
              ) : (
                <div className="text-center">
                  {/* SVG de simulação de QR Code moderno */}
                  <div className="w-44 h-44 bg-[#0a0d14] rounded-xl flex items-center justify-center text-[#00ddd7] p-3 font-mono text-[9px] relative">
                    <div className="absolute inset-2 border-2 border-[#00ddd7] border-dashed rounded-lg animate-pulse" />
                    <QrCode className="w-28 h-28 text-[#00ddd7]" />
                  </div>
                </div>
              )}
            </div>

            {/* Ações e Instruções */}
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1c2438] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Abra o WhatsApp no smartphone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1c2438] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Toque em <strong>Aparelhos conectados</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1c2438] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Aponte a câmera para esta tela</span>
                </div>
              </div>

              {status !== "CONNECTED" && (
                <button
                  type="button"
                  onClick={handleSimulateQrPair}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
                  {saving ? "Pareando com WhatsApp..." : "Conectar / Simular Pareamento QR"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Meta Cloud API */}
      {tab === "META_CLOUD_API" && (
        <form onSubmit={handleSaveMeta} className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2638]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Meta Cloud API & Embedded Signup</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Oficial Meta
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Sem risco de banimento de chip e homologado para grandes volumes de mensagens.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert("Fluxo Embedded Signup acionado! Na hospedagem oficial ele abre o pop-up da Meta.")}
              className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition flex items-center gap-2 shadow-md shrink-0"
            >
              <Globe className="w-4 h-4" /> Conectar com Facebook (Embedded)
            </button>
          </div>

          {/* Dados do Webhook para Copiar */}
          <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00ddd7]" /> Configuração do Webhook no Meta for Developers:
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0d14] border border-[#1e2638]">
                <div className="truncate">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">URL de Retorno de Chamada</span>
                  <span className="font-mono text-gray-200">{webhookUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(webhookUrl, "url")}
                  className="px-2.5 py-1 rounded bg-[#1c2438] hover:bg-[#252e42] text-[10px] text-gray-300 font-mono transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedField === "url" ? "Copiado!" : "Copiar"}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0d14] border border-[#1e2638]">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Token de Verificação</span>
                  <span className="font-mono text-gray-200">{verifyToken}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(verifyToken, "token")}
                  className="px-2.5 py-1 rounded bg-[#1c2438] hover:bg-[#252e42] text-[10px] text-gray-300 font-mono transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedField === "token" ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>

          {/* Campos Manuais de Credencial */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number ID (ID do Telefone)</label>
              <input
                type="text"
                value={metaPhoneNumberId}
                onChange={(e) => setMetaPhoneNumberId(e.target.value)}
                placeholder="Ex: 104928172938472"
                className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">WABA ID (WhatsApp Business Account ID)</label>
              <input
                type="text"
                value={metaWabaId}
                onChange={(e) => setMetaWabaId(e.target.value)}
                placeholder="Ex: 982736451928374"
                className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Token de Acesso Permanente do Sistema</label>
              <input
                type="password"
                value={metaAccessToken}
                onChange={(e) => setMetaAccessToken(e.target.value)}
                placeholder="EAAGm0PX4ZC9..."
                className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e2638] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              {saving ? "Salvando..." : "Salvar Credenciais da Meta API"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
