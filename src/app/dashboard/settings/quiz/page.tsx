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

export default function SettingsQuizPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quizUrl, setQuizUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState({
    titulo: "Diagnostico Especializado",
    subtitulo: "Responda em 1 minuto para receber uma proposta e simulacao personalizada.",
    step1: {
      titulo: "Qual a sua principal necessidade no momento?",
      opcoes: [
        "Aquisicao / Compra com as melhores condicoes",
        "Reducao de custos e otimizacao fiscal/seguros",
        "Consultoria ou agendamento para esta semana",
        "Comparativo completo de propostas de mercado",
      ],
    },
    step2: {
      titulo: "Qual e a urgencia para a sua decisao?",
      opcoes: [
        "Urgente: Quero resolver ainda nesta semana",
        "Proximos 15 a 30 dias",
        "Apenas pesquisando e comparando valores",
      ],
    },
    botaoCta: "Receber Atendimento Prioritario",
    mensagemSucesso: "Nossa equipe e assistente de IA ja estao preparando seu atendimento.",
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

  const addOpcao1 = () => {
    if (!newOpcao1.trim()) return;
    setConfig({
      ...config,
      step1: {
        ...config.step1,
        opcoes: [...config.step1.opcoes, newOpcao1.trim()],
      },
    });
    setNewOpcao1("");
  };

  const removeOpcao1 = (idx: number) => {
    setConfig({
      ...config,
      step1: {
        ...config.step1,
        opcoes: config.step1.opcoes.filter((_, i) => i !== idx),
      },
    });
  };

  const addOpcao2 = () => {
    if (!newOpcao2.trim()) return;
    setConfig({
      ...config,
      step2: {
        ...config.step2,
        opcoes: [...config.step2.opcoes, newOpcao2.trim()],
      },
    });
    setNewOpcao2("");
  };

  const removeOpcao2 = (idx: number) => {
    setConfig({
      ...config,
      step2: {
        ...config.step2,
        opcoes: config.step2.opcoes.filter((_, i) => i !== idx),
      },
    });
  };

  if (loading) {
    return <div className="p-8 text-xs text-gray-500">Carregando editor de Quiz...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-purple-400" /> Editor do Mini-Quiz de Captação
          </h1>
          <p className="text-xs text-gray-400">
            Personalize as perguntas, opções e textos do quiz público usado nos anúncios de tráfego pago (Meta Ads e Google Ads).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(quizUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] hover:border-[#00ddd7] text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-[#00ddd7]" />
            {copied ? "Link Copiado!" : "Copiar Link Público"}
          </button>

          <a
            href={quizUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" /> Visualizar Quiz
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Configurações do Quiz salvas com sucesso! As alterações já estão no ar.
          </div>
        )}

        {/* 1. Títulos e Cabeçalho */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400">
            1. Título & Subtítulo da Página
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Título Principal do Quiz</label>
              <input
                type="text"
                value={config.titulo}
                onChange={(e) => setConfig({ ...config, titulo: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-purple-400 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Subtítulo Explicativo</label>
              <input
                type="text"
                value={config.subtitulo}
                onChange={(e) => setConfig({ ...config, subtitulo: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* 2. Etapa 1 */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ddd7]">
            2. Pergunta da Etapa 1 (Objetivo / Interesse)
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Enunciado da Pergunta 1</label>
            <input
              type="text"
              value={config.step1.titulo}
              onChange={(e) =>
                setConfig({
                  ...config,
                  step1: { ...config.step1, titulo: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7] font-semibold"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-gray-400">Opções de Resposta:</label>
            <div className="space-y-2">
              {config.step1.opcoes.map((opcao, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs"
                >
                  <span className="text-gray-200">{opcao}</span>
                  <button
                    type="button"
                    onClick={() => removeOpcao1(idx)}
                    className="text-gray-500 hover:text-red-400 p-1"
                    title="Remover opção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar nova opção 1 */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newOpcao1}
                onChange={(e) => setNewOpcao1(e.target.value)}
                placeholder="Digitar nova opção para a Etapa 1..."
                className="flex-1 px-4 py-2 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
              />
              <button
                type="button"
                onClick={addOpcao1}
                className="px-4 py-2 rounded-xl bg-[#1c2438] hover:bg-[#252e42] text-[#00ddd7] text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* 3. Etapa 2 */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400">
            3. Pergunta da Etapa 2 (Urgência / Prazo)
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Enunciado da Pergunta 2</label>
            <input
              type="text"
              value={config.step2.titulo}
              onChange={(e) =>
                setConfig({
                  ...config,
                  step2: { ...config.step2, titulo: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-gray-400">Opções de Resposta:</label>
            <div className="space-y-2">
              {config.step2.opcoes.map((opcao, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs"
                >
                  <span className="text-gray-200">{opcao}</span>
                  <button
                    type="button"
                    onClick={() => removeOpcao2(idx)}
                    className="text-gray-500 hover:text-red-400 p-1"
                    title="Remover opção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar nova opção 2 */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newOpcao2}
                onChange={(e) => setNewOpcao2(e.target.value)}
                placeholder="Digitar nova opção para a Etapa 2..."
                className="flex-1 px-4 py-2 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={addOpcao2}
                className="px-4 py-2 rounded-xl bg-[#1c2438] hover:bg-[#252e42] text-amber-400 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* 4. Botão de CTA e Finalização */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            4. Botão de Envio (CTA)
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Texto do Botão Final</label>
            <input
              type="text"
              value={config.botaoCta}
              onChange={(e) => setConfig({ ...config, botaoCta: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-semibold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Salvando Alterações..." : (
              <>
                <Save className="w-4 h-4" /> Salvar e Atualizar Quiz Público
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
