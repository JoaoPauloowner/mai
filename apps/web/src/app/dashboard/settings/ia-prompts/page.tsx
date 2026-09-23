"use client";

import { useState, useEffect } from "react";
import { Bot, Save, CheckCircle2, Upload, Trash2, FileText, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface KnowledgeDoc {
  id: string;
  titulo: string;
  tipo: string;
  tamanhoBytes: number;
  totalChunks: number;
  createdAt: string;
}

export default function SettingsIaPromptsPage() {
  const [nomeAgente, setNomeAgente] = useState("Aria");
  const [tomVoz, setTomVoz] = useState("consultivo");
  const [delaySegundos, setDelaySegundos] = useState(8);
  const [enviarAudioPtt, setEnviarAudioPtt] = useState(true);
  const [scoreTransbordo, setScoreTransbordo] = useState(80);
  const [saved, setSaved] = useState(false);

  // RAG / Knowledge Base State
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [docTitulo, setDocTitulo] = useState("");
  const [docTipo, setDocTipo] = useState("MANUAL");
  const [docConteudo, setDocConteudo] = useState("");
  const [savingDoc, setSavingDoc] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (e) {
      console.error("Erro ao carregar base de conhecimento", e);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitulo || !docConteudo.trim()) return;

    setSavingDoc(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: docTitulo,
          tipo: docTipo,
          conteudoTexto: docConteudo,
        }),
      });

      if (res.ok) {
        setDocTitulo("");
        setDocConteudo("");
        setShowAddDoc(false);
        fetchDocs();
      }
    } catch (e) {
      console.error("Erro ao adicionar documento", e);
    } finally {
      setSavingDoc(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Deseja realmente remover este documento da Base de Conhecimento?")) return;

    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error("Erro ao remover documento", e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">
          Inteligência Artificial & Base de Conhecimento (RAG)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure a identidade da IA e alimente a base de conhecimento dinâmica (PDFs, regras e tabelas de preços) para consulta em tempo real.
        </p>
      </div>

      {/* 1. Base de Conhecimento Dinâmica (RAG) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Base de Conhecimento do Negócio (RAG)</CardTitle>
            <CardDescription>
              Documentos indexados com busca semântica para responder dúvidas reais de leads.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowAddDoc(!showAddDoc)}>
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Conteúdo</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {showAddDoc && (
            <form onSubmit={handleAddDocument} className="p-4 border border-neutral-300 rounded bg-neutral-50 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="docTitulo"
                  label="Título do Documento ou Tabela"
                  required
                  placeholder="Ex: Tabela de Preços e Prazos 2026"
                  value={docTitulo}
                  onChange={(e) => setDocTitulo(e.target.value)}
                />
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Tipo de Conteúdo</label>
                  <select
                    value={docTipo}
                    onChange={(e) => setDocTipo(e.target.value)}
                    className="w-full rounded border border-neutral-300 bg-white py-1.5 px-3 text-xs text-neutral-900"
                  >
                    <option value="MANUAL">Manual / Regras de Negócio</option>
                    <option value="TABELA_PRECOS">Tabela de Preços / Catálogo</option>
                    <option value="FAQ">Perguntas Frequentes (FAQ)</option>
                    <option value="ESTOQUE">Estoque / Disponibilidade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Texto Completo para Vetorização (Cole aqui o conteúdo do PDF/Tabela)
                </label>
                <textarea
                  required
                  rows={5}
                  value={docConteudo}
                  onChange={(e) => setDocConteudo(e.target.value)}
                  placeholder="Cole aqui o conteúdo técnico, regras de parcelamento, itens inclusos, coberturas ou horários..."
                  className="w-full rounded border border-neutral-300 bg-white p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddDoc(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={savingDoc} isLoading={savingDoc}>
                  Vetorizar e Salvar
                </Button>
              </div>
            </form>
          )}

          {loadingDocs ? (
            <div className="text-xs text-neutral-500 py-4">Carregando base de conhecimento...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-500 border border-dashed border-neutral-300 rounded">
              Nenhum documento cadastrado ainda. Adicione tabelas de preços, estoque ou manuais para a IA responder com precisão.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-neutral-600" />
                    <div>
                      <div className="font-semibold text-neutral-900">{doc.titulo}</div>
                      <div className="text-[11px] text-neutral-500">
                        {doc.tipo} • {doc.totalChunks} chunks vetorizados • {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 transition"
                    title="Excluir documento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Personalidade & Resposta da IA */}
      <form onSubmit={handleSaveSettings}>
        <Card>
          <CardHeader>
            <CardTitle>Comportamento e Atendimento do SDR</CardTitle>
            <CardDescription>
              Ajuste como a assistente virtual interage com os leads no WhatsApp e Instagram Direct.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {saved && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Regras salvas com sucesso!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="nomeAgente"
                label="Nome do Assistente Virtual"
                value={nomeAgente}
                onChange={(e) => setNomeAgente(e.target.value)}
                placeholder="Ex: Aria"
              />

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tom de Voz Predominante
                </label>
                <select
                  value={tomVoz}
                  onChange={(e) => setTomVoz(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white py-1.5 px-3 text-xs text-neutral-900"
                >
                  <option value="consultivo">Consultivo & Especialista (Recomendado)</option>
                  <option value="persuasivo">Comercial & Foco em Fechamento</option>
                  <option value="formal">Corporativo & Formal</option>
                  <option value="descontraido">Amigável & Descontraído</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded border border-neutral-200 space-y-3 bg-neutral-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Simulação de Áudio de Voz (PTT Humanizado)
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    A IA envia áudios gravados na hora com status de gravação ativo.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enviarAudioPtt}
                  onChange={(e) => setEnviarAudioPtt(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-700 mb-1">
                  <span>Delay de Digitação / Gravação</span>
                  <span className="font-mono font-bold text-neutral-900">{delaySegundos}s</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={delaySegundos}
                  onChange={(e) => setDelaySegundos(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-200">
              <Button type="submit" variant="primary">
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
