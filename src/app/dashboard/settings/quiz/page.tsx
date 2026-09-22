"use client";

import { useState, useEffect } from "react";
import {
  FileQuestion,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Copy,
  Sparkles,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsQuizPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quizUrl, setQuizUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState({
    titulo: "Diagnóstico Especializado",
    subtitulo: "Responda em 1 minuto para receber uma proposta e simulação personalizada.",
    step1: {
      titulo: "Qual a sua principal necessidade no momento?",
      opcoes: [
        "Aquisição / Compra com as melhores condições",
        "Redução de custos e otimização fiscal/seguros",
        "Consultoria ou agendamento para esta semana",
        "Comparativo completo de propostas de mercado",
      ],
    },
    step2: {
      titulo: "Qual é a urgência para a sua decisão?",
      opcoes: [
        "Urgente: Quero resolver ainda nesta semana",
        "Próximos 15 a 30 dias",
        "Apenas pesquisando e comparando valores",
      ],
    },
    botaoCta: "Receber Atendimento Prioritário",
    mensagemSucesso: "Nossa equipe e assistente de IA já estão preparando seu atendimento.",
  });

  const [newOpcao1, setNewOpcao1] = useState("");
  const [newOpcao2, setNewOpcao2] = useState("");

  useEffect(() => {
    fetch("/api/settings/quiz")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setConfig(data.config);
        if (data.quizUrl) setQuizUrl(data.quizUrl);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyQuizLink = () => {
    navigator.clipboard.writeText(quizUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAddOpcao1 = () => {
    if (!newOpcao1.trim()) return;
    setConfig((prev) => ({
      ...prev,
      step1: { ...prev.step1, opcoes: [...prev.step1.opcoes, newOpcao1.trim()] },
    }));
    setNewOpcao1("");
  };

  const handleRemoveOpcao1 = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      step1: { ...prev.step1, opcoes: prev.step1.opcoes.filter((_, i) => i !== idx) },
    }));
  };

  const handleAddOpcao2 = () => {
    if (!newOpcao2.trim()) return;
    setConfig((prev) => ({
      ...prev,
      step2: { ...prev.step2, opcoes: [...prev.step2.opcoes, newOpcao2.trim()] },
    }));
    setNewOpcao2("");
  };

  const handleRemoveOpcao2 = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      step2: { ...prev.step2, opcoes: prev.step2.opcoes.filter((_, i) => i !== idx) },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-[#7C8472]">Carregando editor do Quiz...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#2C2E2A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C2E2A]">
            Editor do Mini-Quiz de Captação & Triagem
          </h1>
          <p className="text-xs text-[#63695B] mt-0.5">
            Personalize as perguntas e opções do quiz público utilizado nos seus anúncios para qualificar leads e calcular o Score de IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {quizUrl && (
            <>
              <Button variant="secondary" size="sm" onClick={copyQuizLink}>
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
              </Button>
              <Link href={quizUrl} target="_blank">
                <Button variant="secondary" size="sm">
                  <Eye className="w-3.5 h-3.5 text-[#7A8E75]" />
                  <span>Visualizar Quiz</span>
                </Button>
              </Link>
            </>
          )}

          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-[#DDE8DE] border border-[#C4D7C4] text-[#2D6A4F] text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4" /> Configurações do Quiz salvas com sucesso!
        </div>
      )}

      {/* Box de Informações Gerais */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#2C2E2A] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7A8E75]" /> Textos de Apresentação (Tela Inicial)
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Título do Quiz</label>
            <input
              type="text"
              value={config.titulo}
              onChange={(e) => setConfig({ ...config, titulo: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Subtítulo Explicativo</label>
            <input
              type="text"
              value={config.subtitulo}
              onChange={(e) => setConfig({ ...config, subtitulo: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
            />
          </div>
        </div>
      </div>

      {/* Etapa 1 */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Pergunta da Etapa 1 (Necessidade)</label>
          <input
            type="text"
            value={config.step1.titulo}
            onChange={(e) =>
              setConfig({ ...config, step1: { ...config.step1, titulo: e.target.value } })
            }
            className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-semibold"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[#63695B]">Opções de Resposta</label>
          {config.step1.opcoes.map((opcao, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs"
            >
              <span className="text-[#2C2E2A]">{opcao}</span>
              <button
                type="button"
                onClick={() => handleRemoveOpcao1(idx)}
                className="p-1 rounded text-[#7C8472] hover:text-[#9B2226] transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Adicionar nova opção para a Etapa 1..."
              value={newOpcao1}
              onChange={(e) => setNewOpcao1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOpcao1())}
              className="flex-1 px-4 py-2 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
            />
            <Button variant="secondary" size="sm" type="button" onClick={handleAddOpcao1}>
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Etapa 2 */}
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Pergunta da Etapa 2 (Urgência / Prazo)</label>
          <input
            type="text"
            value={config.step2.titulo}
            onChange={(e) =>
              setConfig({ ...config, step2: { ...config.step2, titulo: e.target.value } })
            }
            className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] font-semibold"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[#63695B]">Opções de Resposta</label>
          {config.step2.opcoes.map((opcao, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs"
            >
              <span className="text-[#2C2E2A]">{opcao}</span>
              <button
                type="button"
                onClick={() => handleRemoveOpcao2(idx)}
                className="p-1 rounded text-[#7C8472] hover:text-[#9B2226] transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Adicionar nova opção para a Etapa 2..."
              value={newOpcao2}
              onChange={(e) => setNewOpcao2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOpcao2())}
              className="flex-1 px-4 py-2 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
            />
            <Button variant="secondary" size="sm" type="button" onClick={handleAddOpcao2}>
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
