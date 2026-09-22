"use client";

import { useState, useEffect } from "react";
import { Building2, Phone, Mail, FileText, CheckCircle2, AlertCircle, Save, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
    return <div className="p-8 text-xs text-[#64748B]">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#0F172A] text-xs font-medium border border-[#CBD5E1] mb-2">
          <Building2 className="w-3.5 h-3.5 text-[#2563EB]" /> Informações da Conta & Tenant
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0F172A]">
          Dados da Empresa & Telefones de Contato
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Cadastre as informações institucionais e o número de WhatsApp comercial oficial da sua empresa.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Cadastro Institucional & Roteamento</CardTitle>
            <CardDescription>
              Configurações utilizadas em mensagens da IA, cabeçalhos de orçamentos e transbordo humano.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success && (
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#C8E5D1] text-[#2563EB] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Informações salvas e atualizadas com sucesso!</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#C8E5D1] text-[#DC2626] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome da Empresa */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" /> Nome Fantasia / Razão Social
                </label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Minha Empresa Ltda"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#64748B]" /> CNPJ da Empresa
                </label>
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>

              {/* Telefone Comercial */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" /> WhatsApp Comercial (Transbordo Humano)
                </label>
                <input
                  type="tel"
                  required
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="(11) 99999-8888"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Número para onde os leads qualificados serão transferidos quando pedirem atendente humano.
                </p>
              </div>

              {/* Telefone Fixo ou Geral */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#64748B]" /> Telefone Geral / Fixo (Opcional)
                </label>
                <input
                  type="tel"
                  value={form.telefoneComercial}
                  onChange={(e) => setForm({ ...form, telefoneComercial: e.target.value })}
                  placeholder="(11) 3333-4444"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>

              {/* E-mail de Notificações */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" /> E-mail para Alertas e Resumos
                </label>
                <input
                  type="email"
                  value={form.emailNotificacoes}
                  onChange={(e) => setForm({ ...form, emailNotificacoes: e.target.value })}
                  placeholder="comercial@empresa.com.br"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>

              {/* Instagram Handle */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                  <span className="text-[#0F172A]">@</span> Usuário do Instagram
                </label>
                <input
                  type="text"
                  value={form.instagramHandle}
                  onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                  placeholder="@suaempresa"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
