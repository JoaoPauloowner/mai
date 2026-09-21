"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  Target,
  ExternalLink,
  MessageSquare,
  CalendarCheck,
  Building2,
  FileQuestion,
  Plus,
  StickyNote,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";

interface NoteItem {
  id: string;
  autor: string;
  texto: string;
  createdAt: string;
}

interface AppointmentItem {
  id: string;
  titulo: string;
  descricao?: string | null;
  dataHorario: string | Date;
  status: string;
  tipo: string;
}

interface LeadDetailClientProps {
  lead: {
    id: string;
    nome: string;
    telefone: string;
    email?: string | null;
    empresa?: string | null;
    status: string;
    prioridade: string;
    score: number;
    scoreJustificativa?: string | null;
    valorNegocio?: number | null;
    origemCanal: string;
    utmSource?: string | null;
    utmCampaign?: string | null;
    utmMedium?: string | null;
    directKeyword?: string | null;
    quizAnswersJson?: string | null;
    notasInternasJson?: string | null;
    resumoIa?: string | null;
    ramoInteresse?: string | null;
    createdAt: string | Date;
    conversations: Array<{
      id: string;
      canal: string;
      ultimoContato: string | Date;
      messages: Array<{
        id: string;
        remetenteTipo: string;
        conteudo: string;
        createdAt: string | Date;
      }>;
    }>;
    appointments: AppointmentItem[];
  };
}

// Sanitizador para garantir que caracteres corrompidos antigos sejam corrigidos na visualização
function cleanCorruptedText(text: string): string {
  if (!text) return "";
  return text
    .replace(/Aquisio|Aquisio|Aquisio/gi, "Aquisição")
    .replace(/condies|condies|condies/gi, "condições")
    .replace(/Deciso|Deciso|Deciso/gi, "Decisão")
    .replace(/Otimizao|Otimizao/gi, "Otimização")
    .replace(/Simulao|Simulao/gi, "Simulação")
    .replace(/Urgencia|Urgncia/gi, "Urgência")
    .replace(/\uFFFD/g, "");
}

export function LeadDetailClient({ lead: initialLead }: LeadDetailClientProps) {
  const [lead, setLead] = useState(initialLead);
  const [status, setStatus] = useState(initialLead.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Notas Internas
  let parsedNotes: NoteItem[] = [];
  if (lead.notasInternasJson) {
    try {
      parsedNotes = JSON.parse(lead.notasInternasJson);
    } catch {
      parsedNotes = [];
    }
  }
  const [notes, setNotes] = useState<NoteItem[]>(parsedNotes);
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Agendamento Rápido
  const [appointments, setAppointments] = useState<AppointmentItem[]>(lead.appointments || []);
  const [showAppModal, setShowAppModal] = useState(false);
  const [appTitulo, setAppTitulo] = useState("Visita / Demonstração com o Cliente");
  const [appData, setAppData] = useState("");
  const [appHora, setAppHora] = useState("14:00");
  const [appTipo, setAppTipo] = useState("VISITA");
  const [submittingApp, setSubmittingApp] = useState(false);

  // Quiz Answers
  let quizAnswers: Record<string, any> | null = null;
  if (lead.quizAnswersJson) {
    try {
      quizAnswers = JSON.parse(lead.quizAnswersJson);
    } catch {
      quizAnswers = null;
    }
  }

  // Alterar Status do Funil
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdatingStatus(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setLead((prev) => ({ ...prev, status: newStatus }));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Adicionar Nova Nota
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setSubmittingNote(true);

    try {
      const res = await fetch(`/api/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: newNoteText }),
      });
      const data = await res.json();
      if (data.success && data.nota) {
        setNotes((prev) => [data.nota, ...prev]);
        setNewNoteText("");
      }
    } catch (e) {
      console.error("Erro ao adicionar nota", e);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Criar Agendamento Rápido
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appData) return;
    setSubmittingApp(true);

    const isoDate = `${appData}T${appHora}:00`;

    try {
      const res = await fetch(`/api/leads/${lead.id}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: appTitulo,
          dataHorario: isoDate,
          tipo: appTipo,
        }),
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setAppointments((prev) => [data.appointment, ...prev]);
        setShowAppModal(false);
        setStatus("AGENDADO");
        setLead((prev) => ({ ...prev, status: "AGENDADO" }));
      }
    } catch (e) {
      console.error("Erro ao agendar", e);
    } finally {
      setSubmittingApp(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/crm"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Pipeline CRM
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAppModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1c2438] hover:bg-[#253049] border border-[#2e3b54] text-white text-xs font-semibold transition flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-[#00ddd7]" /> Agendar Visita/Reunião
          </button>

          <a
            href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-950"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Chamar no WhatsApp
          </a>

          <Link
            href="/dashboard/inbox"
            className="px-4 py-2 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#00ddd7]/20"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Abrir no Chat Unificado
          </Link>
        </div>
      </div>

      {/* Header do Dossiê */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] text-black text-2xl font-black flex items-center justify-center shadow-[0_0_20px_rgba(0,221,215,0.3)]">
            {lead.nome.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{lead.nome}</h1>
              
              {/* Seletor Rápido de Status no Dossiê */}
              <select
                value={status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#161d2d] text-[#00ddd7] border border-[#2e3b54] cursor-pointer focus:outline-none focus:border-[#00ddd7]"
              >
                <option value="NOVO">NOVO LEAD</option>
                <option value="QUALIFICADO">QUALIFICADO (SQL)</option>
                <option value="AGENDADO">VISITA / REUNIÃO</option>
                <option value="GANHO">VENDA FECHADA</option>
                <option value="PERDIDO">DESQUALIFICADO</option>
              </select>
            </div>
            <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-gray-300">{lead.telefone}</span>
              {lead.email && <span>• {lead.email}</span>}
              {lead.empresa && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-gray-500" /> {lead.empresa}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lead Score Highlight */}
        <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
              Lead Score IA
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {lead.score}/100
            </div>
            <div className="text-[10px] font-semibold text-emerald-400">
              PRIORIDADE {lead.prioridade}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Principal do Dossiê 360° */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda (2 cols): Diagnóstico, Quiz, Anotações e Histórico */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Resumo Executivo da IA */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ddd7] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Diagnóstico & Parecer da IA
            </h3>
            {lead.scoreJustificativa && (
              <p className="text-xs text-gray-300 leading-relaxed bg-[#161d2d] p-3.5 rounded-xl border border-[#252e42]">
                <strong className="text-white block mb-1">Critério de Qualificação:</strong>
                {cleanCorruptedText(lead.scoreJustificativa)}
              </p>
            )}
            {lead.resumoIa && (
              <p className="text-xs text-gray-400 leading-relaxed">
                {cleanCorruptedText(lead.resumoIa)}
              </p>
            )}
          </div>

          {/* Dossiê de Respostas do Mini-Quiz (se houver) */}
          {quizAnswers && (
            <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <FileQuestion className="w-4 h-4" /> Respostas do Mini-Quiz de Captação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(quizAnswers).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs space-y-1"
                  >
                    <span className="text-[10px] text-gray-500 font-mono uppercase block">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-white block">
                      {cleanCorruptedText(String(value))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOVO: Anotações Internas da Equipe Comercial */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Anotações Internas da Equipe
              </span>
              <span className="text-gray-400 text-[11px] font-mono">
                {notes.length} notas
              </span>
            </h3>

            {/* Input de Adicionar Nota */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma observação interna rápida sobre a negociação..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !newNoteText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>

            {/* Lista de Notas */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">
                  Nenhuma anotação registrada ainda. Use o campo acima para salvar observações do cliente.
                </p>
              ) : (
                notes.map((nota) => (
                  <div
                    key={nota.id}
                    className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span className="font-semibold text-amber-400 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> {nota.autor}
                      </span>
                      <span>{new Date(nota.createdAt).toLocaleString("pt-BR")}</span>
                    </div>
                    <p className="text-gray-200">{nota.texto}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Histórico de Conversas e Mensagens */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>Linha do Tempo de Interações</span>
              <span className="text-[#00ddd7] font-mono">
                {lead.conversations.length} canais conectados
              </span>
            </h3>

            <div className="space-y-3">
              {lead.conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 rounded-xl bg-[#0c101a] border border-[#1e2638] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs border-b border-[#1e2638] pb-2">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#00ddd7]" />
                      Canal {conv.canal}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Última mensagem: {formatDate(conv.ultimoContato)}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {conv.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`text-xs p-2.5 rounded-lg ${
                          m.remetenteTipo === "LEAD"
                            ? "bg-[#161d2d] text-gray-300"
                            : "bg-[#00ddd7]/10 border border-[#00ddd7]/30 text-white"
                        }`}
                      >
                        <div className="text-[9px] text-gray-400 font-mono mb-0.5">
                          {m.remetenteTipo} • {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                        <div>{cleanCorruptedText(m.conteudo)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita (1 col): Torre de Atribuição de Marketing & Agendamentos */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#00ddd7] flex items-center gap-2">
              <Target className="w-4 h-4" /> Atribuição de Marketing Ponta a Ponta
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Canal de Aquisição</span>
                <div className="font-bold text-white text-sm">{lead.origemCanal}</div>
              </div>

              {lead.utmSource && (
                <div className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">UTM Source (Fonte)</span>
                  <div className="font-mono text-gray-300">{lead.utmSource}</div>
                </div>
              )}

              {lead.utmCampaign && (
                <div className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">UTM Campaign (Campanha)</span>
                  <div className="font-mono text-[#00ddd7]">{lead.utmCampaign}</div>
                </div>
              )}

              {lead.directKeyword && (
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1">
                  <span className="text-[10px] text-pink-400 font-mono uppercase">Palavra do Direct</span>
                  <div className="font-mono font-bold text-pink-400">#{lead.directKeyword}</div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Valor Previsto do Negócio</span>
                <div className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(lead.valorNegocio)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Data de Cadastro</span>
                <div className="text-gray-300">{formatDate(lead.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Agendamentos Vinculados */}
          <div className="p-5 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" /> Agendamentos & Visitas
              </h3>
              <button
                type="button"
                onClick={() => setShowAppModal(true)}
                className="p-1.5 rounded-lg bg-[#161d2d] hover:bg-[#253049] text-[#00ddd7] transition"
                title="Novo Agendamento"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-gray-500">Nenhum agendamento registrado ainda.</p>
            ) : (
              appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs space-y-1"
                >
                  <div className="font-semibold text-white">{app.titulo}</div>
                  <div className="text-gray-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#00ddd7]" />
                    {formatDate(app.dataHorario)}
                  </div>
                  <div className="inline-block mt-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {app.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Novo Agendamento */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111622] border border-[#1e2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00ddd7]" />
              Agendar Visita ou Reunião
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Título do Compromisso
                </label>
                <input
                  type="text"
                  required
                  value={appTitulo}
                  onChange={(e) => setAppTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={appData}
                    onChange={(e) => setAppData(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={appHora}
                    onChange={(e) => setAppHora(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Tipo de Atendimento
                </label>
                <select
                  value={appTipo}
                  onChange={(e) => setAppTipo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                >
                  <option value="VISITA">Visita Presencial / Test-Drive</option>
                  <option value="REUNIAO_ONLINE">Reunião Online (Google Meet/Zoom)</option>
                  <option value="CONSULTA">Consulta / Avaliação</option>
                  <option value="LIGACAO">Ligação Telefônica / Alinhamento</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#161d2d] hover:bg-[#1e2638] text-xs text-gray-300 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingApp || !appData}
                  className="px-4 py-2 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition disabled:opacity-50"
                >
                  {submittingApp ? "Salvando..." : "Confirmar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
