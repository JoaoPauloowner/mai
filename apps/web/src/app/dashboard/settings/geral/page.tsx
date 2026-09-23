"use client";

import { useState, useEffect } from "react";
import { Building2, Phone, Mail, FileText, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
        method: "POST",
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
    return <div className="p-4 text-xs text-neutral-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          Dados da Empresa & Contato
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Informações institucionais e número de WhatsApp comercial oficial.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Cadastro Institucional & Roteamento</CardTitle>
            <CardDescription>
              Configurações utilizadas em mensagens da IA, orçamentos e transbordo humano.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {success && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Informações salvas com sucesso!</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="nome"
                label="Nome Fantasia / Razão Social"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Minha Empresa Ltda"
              />

              <Input
                id="cnpj"
                label="CNPJ da Empresa"
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
              />

              <Input
                id="whatsappNumber"
                label="WhatsApp Comercial (Transbordo Humano)"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="(11) 99999-8888"
              />

              <Input
                id="telefoneComercial"
                label="Telefone Geral / Fixo (Opcional)"
                value={form.telefoneComercial}
                onChange={(e) => setForm({ ...form, telefoneComercial: e.target.value })}
                placeholder="(11) 3333-4444"
              />

              <Input
                id="emailNotificacoes"
                type="email"
                label="E-mail para Alertas e Resumos"
                value={form.emailNotificacoes}
                onChange={(e) => setForm({ ...form, emailNotificacoes: e.target.value })}
                placeholder="comercial@empresa.com.br"
              />

              <Input
                id="instagramHandle"
                label="Usuário do Instagram"
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                placeholder="@suaempresa"
              />
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>
                <Save className="w-4 h-4" />
                <span>{saving ? "Salvando..." : "Salvar Configurações"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
