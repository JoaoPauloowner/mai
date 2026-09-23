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
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";

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
  const initialNotes: NoteItem[] = initialLead.notasInternasJson
    ? JSON.parse(initialLead.notasInternasJson)
    : [];
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Agendamento Rápido
  const [appointments, setAppointments] = useState<AppointmentItem[]>(
    initialLead.appointments || []
  );
  const [showAppModal, setShowAppModal] = useState(false);
  const [appTitulo, setAppTitulo] = useState("Reunião de Fechamento Comercial");
  const [appData, setAppData] = useState("");
  const [appHora, setAppHora] = useState("14:00");
  const [appTipo, setAppTipo] = useState("VISITA");
  const [submittingApp, setSubmittingApp] = useState(false);

  const quizAnswers = lead.quizAnswersJson ? JSON.parse(lead.quizAnswersJson) : null;

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
      console.error("Erro ao atualizar status", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    <div className="space-y-6 max-w-6xl mx-auto text-[var(--text-main)]">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/crm"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent-primary)]" /> Voltar ao Pipeline CRM
        </Link>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setShowAppModal(true)}>
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Agendar Visita/Reunião</span>
          </Button>

          <a
            href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" size="sm">
              <ExternalLink className="w-3.5 h-3.5 text-[var(--success-text)]" />
              <span>Chamar no WhatsApp</span>
            </Button>
          </a>

          <Link href="/dashboard/inbox">
            <Button variant="primary" size="sm">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Abrir no Chat Unificado</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Header do Dossiê */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)] text-2xl font-black flex items-center justify-center border border-[var(--border-subtle)]">
            {lead.nome.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[var(--text-main)] font-[var(--font-heading)]">{lead.nome}</h1>
              
              <select
                value={status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--bg-canvas)] text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="NOVO">NOVO LEAD</option>
                <option value="QUALIFICADO">QUALIFICADO (SQL)</option>
                <option value="AGENDADO">VISITA / REUNIÃO</option>
                <option value="GANHO">VENDA FECHADA</option>
                <option value="PERDIDO">DESQUALIFICADO</option>
              </select>
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[var(--text-main)]">{lead.telefone}</span>
              {lead.email && <span>• {lead.email}</span>}
              {lead.empresa && (
                <span className="flex items-center gap-1 text-[var(--text-main)]">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> {lead.empresa}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lead Score Highlight */}
        <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
              Lead Score IA
            </div>
            <div className="text-2xl font-extrabold text-[var(--accent-text)] font-mono">
              {lead.score}/100
            </div>
            <div className="text-[10px] font-bold text-[var(--accent-text)]">
              PRIORIDADE {lead.prioridade}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] border border-[var(--border-subtle)] text-[var(--accent-text)] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Principal do Dossiê 360° */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnóstico da IA */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4" /> Diagnóstico & Parecer da IA
            </h3>
            {lead.scoreJustificativa && (
              <p className="text-xs text-[var(--text-main)] leading-relaxed bg-[var(--bg-canvas)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-main)] block mb-1">Critério de Qualificação:</strong>
                {cleanCorruptedText(lead.scoreJustificativa)}
              </p>
            )}
            {lead.resumoIa && (
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {cleanCorruptedText(lead.resumoIa)}
              </p>
            )}
          </div>

          {/* Respostas do Mini-Quiz */}
          {quizAnswers && (
            <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] flex items-center gap-2 font-bold">
                <FileQuestion className="w-4 h-4" /> Respostas do Mini-Quiz de Captação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(quizAnswers).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs space-y-1"
                  >
                    <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase block">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-[var(--text-main)] block">
                      {cleanCorruptedText(String(value))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anotações Internas da Equipe */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] flex items-center justify-between font-bold">
              <span className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Anotações Internas da Equipe
              </span>
              <span className="text-[var(--text-muted)] text-[11px] font-mono">
                {notes.length} notas
              </span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma observação interna rápida sobre a negociação..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <Button variant="secondary" size="sm" type="submit" disabled={submittingNote || !newNoteText.trim()}>
                  <Send className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </Button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic py-2">
                  Nenhuma anotação registrada ainda. Use o campo acima para salvar observações do cliente.
                </p>
              ) : (
                notes.map((nota) => (
                  <div
                    key={nota.id}
                    className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                      <span className="font-semibold text-[var(--accent-text)] flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> {nota.autor}
                      </span>
                      <span>{new Date(nota.createdAt).toLocaleString("pt-BR")}</span>
                    </div>
                    <p className="text-[var(--text-main)]">{nota.texto}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Atribuição & Agendamentos */}
        <div className="space-y-6">
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] flex items-center gap-2 font-bold">
              <Target className="w-4 h-4" /> Atribuição de Marketing Ponta a Ponta
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Canal de Aquisição</span>
                <div className="font-bold text-[var(--text-main)] text-sm">{lead.origemCanal}</div>
              </div>

              {lead.utmSource && (
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">UTM Source (Fonte)</span>
                  <div className="font-mono text-[var(--text-main)]">{lead.utmSource}</div>
                </div>
              )}

              {lead.utmCampaign && (
                <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">UTM Campaign (Campanha)</span>
                  <div className="font-mono text-[var(--accent-text)] font-bold">{lead.utmCampaign}</div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Valor Previsto do Negócio</span>
                <div className="font-mono font-bold text-[var(--text-main)] text-sm">
                  {formatCurrency(lead.valorNegocio)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Data de Cadastro</span>
                <div className="text-[var(--text-main)]">{formatDate(lead.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Agendamentos */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2 font-bold font-[var(--font-heading)]">
                <CalendarCheck className="w-4 h-4 text-[var(--accent-primary)]" /> Agendamentos & Visitas
              </h3>
              <button
                type="button"
                onClick={() => setShowAppModal(true)}
                className="p-1.5 rounded-lg bg-[var(--bg-canvas)] hover:bg-[var(--accent-soft)] text-[var(--text-main)] transition"
                title="Novo Agendamento"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">Nenhum agendamento registrado ainda.</p>
            ) : (
              appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs space-y-1"
                >
                  <div className="font-semibold text-[var(--text-main)]">{app.titulo}</div>
                  <div className="text-[var(--text-muted)] font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--accent-primary)]" />
                    {formatDate(app.dataHorario)}
                  </div>
                  <div className="inline-block mt-1">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Novo Agendamento */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 font-[var(--font-heading)]">
              <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
              Agendar Visita ou Reunião
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase font-mono block mb-1">
                  Título do Compromisso
                </label>
                <input
                  type="text"
                  required
                  value={appTitulo}
                  onChange={(e) => setAppTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] uppercase font-mono block mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={appData}
                    onChange={(e) => setAppData(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted)] uppercase font-mono block mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={appHora}
                    onChange={(e) => setAppHora(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] uppercase font-mono block mb-1">
                  Tipo de Atendimento
                </label>
                <select
                  value={appTipo}
                  onChange={(e) => setAppTipo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  <option value="VISITA">Visita Presencial / Test-Drive</option>
                  <option value="REUNIAO_ONLINE">Reunião Online (Google Meet/Zoom)</option>
                  <option value="CONSULTA">Consulta / Avaliação</option>
                  <option value="LIGACAO">Ligação Telefônica / Alinhamento</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowAppModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submittingApp || !appData}>
                  {submittingApp ? "Salvando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
