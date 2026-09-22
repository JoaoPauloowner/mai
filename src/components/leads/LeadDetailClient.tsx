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
    <div className="space-y-6 max-w-6xl mx-auto text-[#2C2E2A]">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/crm"
          className="inline-flex items-center gap-2 text-xs text-[#63695B] hover:text-[#2C2E2A] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 text-[#7A8E75]" /> Voltar ao Pipeline CRM
        </Link>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setShowAppModal(true)}>
            <Calendar className="w-3.5 h-3.5 text-[#7A8E75]" />
            <span>Agendar Visita/Reunião</span>
          </Button>

          <a
            href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" size="sm">
              <ExternalLink className="w-3.5 h-3.5 text-[#2D6A4F]" />
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
      <div className="p-6 rounded-2xl bg-white border border-[#E0E3DE] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAE2CA] text-[#2C2E2A] text-2xl font-black flex items-center justify-center border border-[#D0D5CD]">
            {lead.nome.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#2C2E2A]">{lead.nome}</h1>
              
              <select
                value={status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F5F5F5] text-[#2C2E2A] border border-[#E0E3DE] cursor-pointer focus:outline-none focus:border-[#7A8E75]"
              >
                <option value="NOVO">NOVO LEAD</option>
                <option value="QUALIFICADO">QUALIFICADO (SQL)</option>
                <option value="AGENDADO">VISITA / REUNIÃO</option>
                <option value="GANHO">VENDA FECHADA</option>
                <option value="PERDIDO">DESQUALIFICADO</option>
              </select>
            </div>
            <div className="text-xs text-[#63695B] mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[#2C2E2A]">{lead.telefone}</span>
              {lead.email && <span>• {lead.email}</span>}
              {lead.empresa && (
                <span className="flex items-center gap-1 text-[#2C2E2A]">
                  <Building2 className="w-3.5 h-3.5 text-[#7A8E75]" /> {lead.empresa}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lead Score Highlight */}
        <div className="p-4 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#63695B]">
              Lead Score IA
            </div>
            <div className="text-2xl font-extrabold text-[#2D6A4F] font-mono">
              {lead.score}/100
            </div>
            <div className="text-[10px] font-bold text-[#2D6A4F]">
              PRIORIDADE {lead.prioridade}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#DDE8DE] border border-[#C4D7C4] text-[#2D6A4F] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Principal do Dossiê 360° */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnóstico da IA */}
          <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] space-y-3 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A8E75] flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4" /> Diagnóstico & Parecer da IA
            </h3>
            {lead.scoreJustificativa && (
              <p className="text-xs text-[#2C2E2A] leading-relaxed bg-[#F5F5F5] p-3.5 rounded-xl border border-[#E0E3DE]">
                <strong className="text-[#2C2E2A] block mb-1">Critério de Qualificação:</strong>
                {cleanCorruptedText(lead.scoreJustificativa)}
              </p>
            )}
            {lead.resumoIa && (
              <p className="text-xs text-[#63695B] leading-relaxed">
                {cleanCorruptedText(lead.resumoIa)}
              </p>
            )}
          </div>

          {/* Respostas do Mini-Quiz */}
          {quizAnswers && (
            <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A8E75] flex items-center gap-2 font-bold">
                <FileQuestion className="w-4 h-4" /> Respostas do Mini-Quiz de Captação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(quizAnswers).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs space-y-1"
                  >
                    <span className="text-[10px] text-[#7C8472] font-mono uppercase block">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-[#2C2E2A] block">
                      {cleanCorruptedText(String(value))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anotações Internas da Equipe */}
          <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8F5D18] flex items-center justify-between font-bold">
              <span className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Anotações Internas da Equipe
              </span>
              <span className="text-[#7C8472] text-[11px] font-mono">
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
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] placeholder:text-[#7C8472] focus:outline-none focus:border-[#7A8E75]"
                />
                <Button variant="secondary" size="sm" type="submit" disabled={submittingNote || !newNoteText.trim()}>
                  <Send className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </Button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-[#7C8472] italic py-2">
                  Nenhuma anotação registrada ainda. Use o campo acima para salvar observações do cliente.
                </p>
              ) : (
                notes.map((nota) => (
                  <div
                    key={nota.id}
                    className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#63695B] font-mono">
                      <span className="font-semibold text-[#8F5D18] flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> {nota.autor}
                      </span>
                      <span>{new Date(nota.createdAt).toLocaleString("pt-BR")}</span>
                    </div>
                    <p className="text-[#2C2E2A]">{nota.texto}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Atribuição & Agendamentos */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] space-y-4 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A8E75] flex items-center gap-2 font-bold">
              <Target className="w-4 h-4" /> Atribuição de Marketing Ponta a Ponta
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-1">
                <span className="text-[10px] text-[#7C8472] font-mono uppercase">Canal de Aquisição</span>
                <div className="font-bold text-[#2C2E2A] text-sm">{lead.origemCanal}</div>
              </div>

              {lead.utmSource && (
                <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-1">
                  <span className="text-[10px] text-[#7C8472] font-mono uppercase">UTM Source (Fonte)</span>
                  <div className="font-mono text-[#2C2E2A]">{lead.utmSource}</div>
                </div>
              )}

              {lead.utmCampaign && (
                <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-1">
                  <span className="text-[10px] text-[#7C8472] font-mono uppercase">UTM Campaign (Campanha)</span>
                  <div className="font-mono text-[#2D6A4F] font-bold">{lead.utmCampaign}</div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-1">
                <span className="text-[10px] text-[#7C8472] font-mono uppercase">Valor Previsto do Negócio</span>
                <div className="font-mono font-bold text-[#2C2E2A] text-sm">
                  {formatCurrency(lead.valorNegocio)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-1">
                <span className="text-[10px] text-[#7C8472] font-mono uppercase">Data de Cadastro</span>
                <div className="text-[#2C2E2A]">{formatDate(lead.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Agendamentos */}
          <div className="p-5 rounded-2xl bg-white border border-[#E0E3DE] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2E2A] flex items-center gap-2 font-bold">
                <CalendarCheck className="w-4 h-4 text-[#7A8E75]" /> Agendamentos & Visitas
              </h3>
              <button
                type="button"
                onClick={() => setShowAppModal(true)}
                className="p-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#E7EBE6] text-[#2C2E2A] transition"
                title="Novo Agendamento"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-[#7C8472]">Nenhum agendamento registrado ainda.</p>
            ) : (
              appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs space-y-1"
                >
                  <div className="font-semibold text-[#2C2E2A]">{app.titulo}</div>
                  <div className="text-[#63695B] font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#7A8E75]" />
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
          <div className="w-full max-w-md bg-white border border-[#E0E3DE] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#2C2E2A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7A8E75]" />
              Agendar Visita ou Reunião
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#63695B] uppercase font-mono block mb-1">
                  Título do Compromisso
                </label>
                <input
                  type="text"
                  required
                  value={appTitulo}
                  onChange={(e) => setAppTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#63695B] uppercase font-mono block mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={appData}
                    onChange={(e) => setAppData(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#63695B] uppercase font-mono block mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={appHora}
                    onChange={(e) => setAppHora(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#63695B] uppercase font-mono block mb-1">
                  Tipo de Atendimento
                </label>
                <select
                  value={appTipo}
                  onChange={(e) => setAppTipo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
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
