"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  ChevronRight,
  GripVertical,
} from "lucide-react";

interface LeadItem {
  id: string;
  nome: string;
  telefone: string;
  status: string;
  prioridade: string;
  score: number;
  scoreJustificativa?: string | null;
  valorNegocio?: number | null;
  origemCanal: string;
  utmCampaign?: string | null;
  directKeyword?: string | null;
  ramoInteresse?: string | null;
  createdAt: string | Date;
}

const COLUMNS = [
  { id: "NOVO", label: "Novos Leads", badgeStyle: "bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]" },
  { id: "QUALIFICADO", label: "Qualificados (SQL)", badgeStyle: "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]" },
  { id: "AGENDADO", label: "Visita / Reunião", badgeStyle: "bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]" },
  { id: "GANHO", label: "Venda Concluída", badgeStyle: "bg-[var(--accent-soft)] text-[var(--accent-ink)] border-[var(--accent-primary)]/30" },
  { id: "PERDIDO", label: "Desqualificados", badgeStyle: "bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]" },
];

export function CrmKanbanClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  const moveLead = async (leadId: string, targetStatus: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l))
    );
    setMovingLeadId(leadId);

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
    } catch (e) {
      console.error("Falha ao mover lead", e);
    } finally {
      setMovingLeadId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColId(null);
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    if (leadId) {
      moveLead(leadId, colId);
      setDraggedLeadId(null);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 select-none min-h-[calc(100vh-220px)] text-[var(--text-main)]">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col.id);
        const colTotalValor = colLeads.reduce(
          (acc, l) => acc + (l.valorNegocio || 0),
          0
        );

        const isOver = dragOverColId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`w-80 shrink-0 flex flex-col rounded-[var(--radius-lg)] bg-[var(--bg-canvas)] border transition-all ${
              isOver ? "border-[var(--accent-primary)] bg-[var(--bg-subtle)]" : "border-[var(--border-subtle)]"
            }`}
          >
            {/* Header da Coluna */}
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-t-[var(--radius-lg)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${col.badgeStyle}`}>
                    {colLeads.length}
                  </span>
                  <h3 className="font-bold text-xs text-[var(--text-main)]">{col.label}</h3>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-subtle)] mt-0.5 block">
                  {colTotalValor > 0 ? formatCurrency(colTotalValor) : "R$ 0,00"}
                </span>
              </div>
            </div>

            {/* Lista de Leads da Coluna */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {colLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className={`p-4 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] hover:border-[var(--accent-primary)] transition cursor-grab active:cursor-grabbing space-y-2.5 ${
                    movingLeadId === lead.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0" />
                      <span className="font-bold text-xs text-[var(--text-main)] truncate">{lead.nome}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)]">
                      Score {lead.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span className="font-mono">{lead.telefone}</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      {lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}
                    </span>
                  </div>

                  {lead.utmCampaign && (
                    <div className="text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] truncate">
                      Campanha: {lead.utmCampaign}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] text-[10px]">
                    <span className="text-[var(--text-subtle)] font-mono">{lead.origemCanal || "WhatsApp"}</span>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-bold text-[var(--accent-ink)] hover:underline flex items-center gap-0.5 transition"
                    >
                      <span>Ver Dossiê</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {colLeads.length === 0 && (
                <div className="py-8 text-center text-xs text-[var(--text-subtle)] border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-md)]">
                  Nenhum lead nesta etapa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
