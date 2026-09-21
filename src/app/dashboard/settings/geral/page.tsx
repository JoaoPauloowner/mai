"use client";

import { useState, useEffect } from "react";
import { Building2, Phone, Mail, FileText, CheckCircle2, AlertCircle, Save, Sparkles } from "lucide-react";

export default function SettingsGeralPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "",
    telefoneComercial: "",
    whatsappNumber: "",
    cnpj: "",
    emailNotificacoes: "",
    instagramHandle: "",
  });

  useEffect(() => {
    fetch("/api/settings/organization")
      .then((res) => res.json())
      .then((data) => {
        if (data.organization) {
          setForm({
            nome: data.organization.nome || "",
            telefoneComercial: data.organization.telefoneComercial || "",
            whatsappNumber: data.organization.whatsappNumber || "",
            cnpj: data.organization.cnpj || "",
            emailNotificacoes: data.organization.emailNotificacoes || "",
            instagramHandle: data.organization.instagramHandle || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/settings/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar dados.");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-gray-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Dados da Empresa & Telefones de Contato
        </h1>
        <p className="text-xs text-gray-400">
          Cadastre as informações institucionais e o número de WhatsApp comercial oficial da sua empresa.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-6 shadow-xl">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Informações salvas e atualizadas com sucesso!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nome da Empresa */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#00ddd7]" /> Nome Fantasia / Razão Social
            </label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Minha Empresa Ltda"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
          </div>

          {/* CNPJ */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" /> CNPJ da Empresa
            </label>
            <input
              type="text"
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
          </div>

          {/* Telefone Comercial */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Comercial (Transbordo Humano)
            </label>
            <input
              type="tel"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="(11) 99999-8888"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Número para onde os leads qualificados serão transferidos quando pedirem atendente humano.
            </p>
          </div>

          {/* Telefone Fixo ou Geral */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Telefone Geral / Fixo (Opcional)
            </label>
            <input
              type="tel"
              value={form.telefoneComercial}
              onChange={(e) => setForm({ ...form, telefoneComercial: e.target.value })}
              placeholder="(11) 3333-4444"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
          </div>

          {/* E-mail de Notificações */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> E-mail para Alertas e Resumos
            </label>
            <input
              type="email"
              value={form.emailNotificacoes}
              onChange={(e) => setForm({ ...form, emailNotificacoes: e.target.value })}
              placeholder="comercial@empresa.com.br"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <span className="text-pink-400">@</span> Usuário do Instagram
            </label>
            <input
              type="text"
              value={form.instagramHandle}
              onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
              placeholder="@suaempresa"
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1e2638] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
