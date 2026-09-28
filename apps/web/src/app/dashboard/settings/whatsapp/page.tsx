"use client";

import { useState, useEffect, useCallback } from "react";
import {
  QrCode,
  Globe,
  CheckCircle2,
  RefreshCw,
  PowerOff,
  Sparkles,
  Copy,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function SettingsWhatsappPage() {
  const [tab, setTab] = useState<"QR_CODE" | "META_CLOUD_API">("QR_CODE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [embeddedStatus, setEmbeddedStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [embeddedMsg, setEmbeddedMsg] = useState("");

  const [status, setStatus] = useState<"CONNECTED" | "DISCONNECTED" | "CONNECTING">("DISCONNECTED");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);

  const [metaPhoneNumberId, setMetaPhoneNumberId] = useState("");
  const [metaWabaId, setMetaWabaId] = useState("");
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [verifyToken, setVerifyToken] = useState("");

  // ─── Carrega FB SDK ────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) return;
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v21.0",
      });
    };
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ─── Carrega config atual ──────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/settings/whatsapp")
      .then((r) => r.json())
      .then((data) => {
        if (data.config) {
          setStatus(data.config.whatsappStatus || "DISCONNECTED");
          setTab((data.config.whatsappTipoConexao as any) || "QR_CODE");
          setWhatsappNumber(data.config.whatsappNumber || "");
          setMetaPhoneNumberId(data.config.metaPhoneNumberId || "");
          setMetaWabaId(data.config.metaWabaId || "");
          setMetaAccessToken(data.config.metaAccessToken ? "••••••••••••••••" : "");
        }
        if (data.webhookUrl) setWebhookUrl(data.webhookUrl);
        if (data.verifyToken) setVerifyToken(data.verifyToken);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "QR_CODE" && status !== "CONNECTED" && !loading) fetchQr();
  }, [tab, status, loading]);

  // ─── Embedded Signup ───────────────────────────────────────────────────
  const launchEmbeddedSignup = useCallback(() => {
    if (!window.FB) {
      setEmbeddedStatus("error");
      setEmbeddedMsg("Facebook SDK não carregou. Recarregue a página e tente novamente.");
      return;
    }
    setEmbeddedStatus("loading");
    setEmbeddedMsg("Aguardando autorização no popup da Meta...");

    window.FB.login(
      async (response: any) => {
        if (!response.authResponse) {
          setEmbeddedStatus("error");
          setEmbeddedMsg("Autorização cancelada ou recusada.");
          return;
        }
        const { accessToken, code } = response.authResponse;
        setSaving(true);
        setEmbeddedMsg("Salvando credenciais e consultando conta WhatsApp Business...");
        try {
          const res = await fetch("/api/settings/whatsapp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "EMBEDDED_SIGNUP", accessToken: accessToken || code }),
          });
          const data = await res.json();
          if (data.success) {
            setStatus("CONNECTED");
            setMetaPhoneNumberId(data.phoneNumberId || "");
            setMetaWabaId(data.wabaId || "");
            setMetaAccessToken("••••••••••••••••");
            setEmbeddedStatus("success");
            setEmbeddedMsg(`✅ WhatsApp conectado! Número: ${data.displayPhoneNumber || data.phoneNumberId}`);
          } else {
            setEmbeddedStatus("error");
            setEmbeddedMsg(data.error || "Erro ao salvar credenciais.");
          }
        } catch {
          setEmbeddedStatus("error");
          setEmbeddedMsg("Erro de rede ao salvar. Verifique sua conexão.");
        } finally {
          setSaving(false);
        }
      },
      {
        scope: "whatsapp_business_management,whatsapp_business_messaging,business_management,public_profile",
        extras: { feature: "whatsapp_embedded_signup", version: 2, sessionInfoVersion: 3, setup: {} },
        return_scopes: true,
        enable_profile_selector: true,
      }
    );
  }, []);

  const fetchQr = async () => {
    setQrLoading(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "FETCH_QR" }),
      });
      const data = await res.json();
      if (data.evolution?.qrcodeBase64) setQrImage(data.evolution.qrcodeBase64);
      if (data.evolution?.status === "connected") setStatus("CONNECTED");
    } catch (e) {
      console.error("Falha ao buscar QR Code", e);
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 3000);
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setPhoneSaved(false);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SAVE_PHONE", whatsappNumber }),
      });
      if (res.ok) { setPhoneSaved(true); setTimeout(() => setPhoneSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const handleVerifyOrConnectQr = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONNECT_QR", whatsappNumber: whatsappNumber || "+5511999990001" }),
      });
      const data = await res.json();
      if (data.evolution?.status === "connected" || res.ok) {
        setStatus("CONNECTED");
        setWhatsappNumber(whatsappNumber || "+5511999990001");
      }
      if (data.evolution?.qrcodeBase64) setQrImage(data.evolution.qrcodeBase64);
    } finally { setSaving(false); }
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SAVE_META", metaPhoneNumberId, metaWabaId, metaAccessToken, whatsappNumber }),
      });
      if (res.ok) setStatus("CONNECTED");
    } finally { setSaving(false); }
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
        setQrImage(null);
        setMetaPhoneNumberId(""); setMetaWabaId(""); setMetaAccessToken("");
        setEmbeddedStatus("idle"); setEmbeddedMsg("");
        fetchQr();
      }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-xs text-[#7C8472]">Carregando módulo de WhatsApp...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#2C2E2A]">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Conexão do WhatsApp Comercial</h1>
        <p className="text-xs text-[#63695B] mt-0.5">
          Conecte o número via QR Code (Evolution API v2) ou via API Oficial da Meta com Embedded Signup automático.
        </p>
      </div>

      {/* Status Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} size="md" />
          <div>
            <div className="text-xs font-bold">
              {status === "CONNECTED" ? "Sessão Ativa — WhatsApp Pareado" : "Aguardando Conexão"}
            </div>
            {whatsappNumber && <p className="text-[11px] text-[#63695B] font-mono mt-0.5">Número: {whatsappNumber}</p>}
            {metaWabaId && <p className="text-[11px] text-[#63695B] font-mono">WABA ID: {metaWabaId}</p>}
          </div>
        </div>
        {status === "CONNECTED" && (
          <Button variant="danger" size="sm" onClick={handleDisconnect} disabled={saving}>
            <PowerOff className="w-3.5 h-3.5" /> <span>Desconectar</span>
          </Button>
        )}
      </div>

      {/* Número wa.me */}
      <form onSubmit={handleSavePhone} className="p-5 rounded-2xl bg-white border border-[#E0E3DE] flex flex-col sm:flex-row sm:items-end gap-4 shadow-xs">
        <div className="flex-1 space-y-1">
          <label className="block text-xs font-bold">Número para Links wa.me e Destino de Leads</label>
          <input
            type="text" required placeholder="Ex: +55 (11) 98765-4321"
            value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full px-4 py-2 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs font-mono focus:outline-none focus:border-[#7A8E75]"
          />
        </div>
        <Button variant="primary" size="sm" type="submit" disabled={saving || !whatsappNumber.trim()}>
          {phoneSaved ? "Salvo!" : "Salvar Número"}
        </Button>
      </form>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#E7EBE6] border border-[#D0D5CD] rounded-xl w-fit">
        {(["QR_CODE", "META_CLOUD_API"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${tab === t ? "bg-white text-[#2C2E2A] shadow-xs" : "text-[#63695B] hover:text-[#2C2E2A]"}`}
          >
            {t === "QR_CODE" ? <><QrCode className="w-4 h-4 text-[#7A8E75]" /> QR Code (Evolution API)</> : <><Globe className="w-4 h-4 text-[#7A8E75]" /> Meta Cloud API Oficial</>}
          </button>
        ))}
      </div>

      {/* ─── QR Code ─────────────────────────────────────────────────────── */}
      {tab === "QR_CODE" && (
        <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold">Escanear com o Celular</h3>
            <p className="text-xs text-[#63695B] mt-0.5">WhatsApp &gt; Aparelhos Conectados &gt; Conectar um Aparelho.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
            <div className="w-60 h-60 rounded-2xl bg-[#F5F5F5] border border-[#E0E3DE] p-3 flex items-center justify-center shadow-xs">
              {status === "CONNECTED" ? (
                <div className="text-center"><CheckCircle2 className="w-14 h-14 text-[#2D6A4F] mx-auto mb-2" /><span className="text-xs font-bold block">WhatsApp Conectado!</span></div>
              ) : qrLoading ? (
                <div className="text-center"><RefreshCw className="w-8 h-8 text-[#7A8E75] animate-spin mx-auto" /><span className="text-[11px] text-[#63695B] block mt-2 font-mono">Gerando QR Code...</span></div>
              ) : qrImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`} alt="QR Code" className="w-48 h-48 rounded-xl object-contain bg-white border border-[#E0E3DE]" />
              ) : (
                <div className="w-44 h-44 bg-white border border-[#E0E3DE] rounded-xl flex items-center justify-center"><QrCode className="w-28 h-28 text-[#2C2E2A]" /></div>
              )}
            </div>
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2 text-xs">
                {["Abra o WhatsApp no smartphone", "Toque em Aparelhos conectados", "Aponte a câmera para esta tela"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EAE2CA] flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              {status !== "CONNECTED" && (
                <div className="space-y-2">
                  <Button variant="primary" size="md" className="w-full" onClick={handleVerifyOrConnectQr} disabled={saving || qrLoading}>
                    <RefreshCw className={`w-4 h-4 ${saving || qrLoading ? "animate-spin" : ""}`} />
                    <span>{saving ? "Verificando..." : "Verificar / Confirmar Pareamento"}</span>
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full" onClick={fetchQr} disabled={qrLoading}>
                    <RefreshCw className={`w-3.5 h-3.5 ${qrLoading ? "animate-spin" : ""}`} /> <span>Atualizar QR Code</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Meta Cloud API ────────────────────────────────────────────────── */}
      {tab === "META_CLOUD_API" && (
        <div className="space-y-4">
          {/* Embedded Signup */}
          <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E3DE]">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F4A261]" />
                  Conectar via Meta (Embedded Signup)
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DDE8DE] text-[#2D6A4F] border border-[#C4D7C4] font-bold">Recomendado</span>
                </h3>
                <p className="text-xs text-[#63695B] mt-1">
                  Conecte em 1 clique. O cliente autoriza via popup oficial da Meta — sem digitar tokens manualmente.
                </p>
              </div>
              <Button variant="primary" size="md" type="button" onClick={launchEmbeddedSignup}
                disabled={saving || embeddedStatus === "loading"} className="whitespace-nowrap">
                <Globe className="w-4 h-4" />
                <span>{embeddedStatus === "loading" ? "Aguardando Meta..." : status === "CONNECTED" ? "Reconectar com Facebook" : "Conectar com Facebook"}</span>
              </Button>
            </div>

            {embeddedMsg && (
              <div className={`p-3 rounded-xl text-xs font-mono border ${
                embeddedStatus === "success" ? "bg-[#DDE8DE] border-[#C4D7C4] text-[#2D6A4F]"
                : embeddedStatus === "error" ? "bg-[#FFEDED] border-[#FFBCBC] text-[#C0392B]"
                : "bg-[#FFF8E7] border-[#F4D58D] text-[#7A6000]"}`}>
                {embeddedMsg}
              </div>
            )}

            {embeddedStatus === "idle" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { n: "1", t: "Clique no botão", d: "Abre o popup oficial da Meta" },
                  { n: "2", t: "Autorize a conta", d: "Selecione o número WhatsApp Business" },
                  { n: "3", t: "Pronto!", d: "Credenciais salvas automaticamente" },
                ].map((s) => (
                  <div key={s.n} className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-center">
                    <span className="w-6 h-6 rounded-full bg-[#EAE2CA] flex items-center justify-center text-[10px] font-bold mx-auto mb-2">{s.n}</span>
                    <p className="text-xs font-bold">{s.t}</p>
                    <p className="text-[10px] text-[#63695B] mt-0.5">{s.d}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dados do Webhook */}
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-3">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7A8E75]" /> Dados do Webhook (Meta for Developers):
              </div>
              <div className="space-y-2 text-xs">
                {[{ label: "URL de Retorno de Chamada", value: webhookUrl, key: "url" }, { label: "Token de Verificação", value: verifyToken, key: "token" }].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E0E3DE]">
                    <div className="truncate">
                      <span className="text-[10px] text-[#7C8472] uppercase font-mono block">{item.label}</span>
                      <span className="font-mono">{item.value}</span>
                    </div>
                    <button type="button" onClick={() => copyToClipboard(item.value, item.key)}
                      className="px-2.5 py-1 rounded bg-[#E7EBE6] hover:bg-[#D0D5CD] text-[10px] font-mono transition flex items-center gap-1 ml-2 shrink-0">
                      <Copy className="w-3 h-3" /> {copiedField === item.key ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inserção Manual */}
          <form onSubmit={handleSaveMeta} className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E0E3DE]">
              <ShieldCheck className="w-4 h-4 text-[#7A8E75]" />
              <h3 className="text-sm font-bold">Inserção Manual de Credenciais</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F5F5] text-[#7C8472] border border-[#E0E3DE]">Avançado</span>
            </div>
            <p className="text-xs text-[#63695B]">Para quem já tem WABA e token gerado no Business Manager.</p>
            <div className="space-y-3">
              {[
                { label: "Phone Number ID", value: metaPhoneNumberId, setter: setMetaPhoneNumberId, placeholder: "Ex: 104928172938472", type: "text" },
                { label: "WABA ID (WhatsApp Business Account ID)", value: metaWabaId, setter: setMetaWabaId, placeholder: "Ex: 982736451928374", type: "text" },
                { label: "Token de Acesso Permanente", value: metaAccessToken, setter: setMetaAccessToken, placeholder: "EAAGm0PX4ZC9...", type: "password" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold mb-1">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs focus:outline-none focus:border-[#7A8E75] font-mono" />
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="md" type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Credenciais Manualmente"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
