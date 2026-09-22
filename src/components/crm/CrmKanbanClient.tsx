"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ChevronRight,
  GripVertical,
  Plus,
  Phone,
  MessageSquare,
  CalendarCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

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
  { id: "NOVO", label: "Novos Leads", bgHeader: "bg-[#E1D6AF]/40 text-[#8F5D18]" },
  { id: "QUALIFICADO", label: "Qualificados (SQL)", bgHeader: "bg-[#DDE8DE] text-[#2D6A4F]" },
  { id: "AGENDADO", label: "Visita / Reunião", bgHeader: "bg-[#EAE2CA] text-[#2C2E2A]" },
  { id: "GANHO", label: "Venda Concluída", bgHeader: "bg-[#C1ED84] text-[#2C2E2A]" },
  { id: "PERDIDO", label: "Desqualificados", bgHeader: "bg-[#E9BEC4] text-[#9B2226]" },
];

export function CrmKanbanClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  const moveLead = async (leadId: string, targetStatus: string) => {
    // Atualização otimista imediata na UI
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
    <div className="flex gap-4 overflow-x-auto pb-4 select-none min-h-[calc(100vh-200px)] text-[#2C2E2A]">
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
            className={`w-80 shrink-0 flex flex-col rounded-2xl bg-[#F5F5F5] border transition-all ${
              isOver ? "border-[#7A8E75] bg-[#E7EBE6]" : "border-[#E0E3DE]"
            }`}
          >
            {/* Header da Coluna */}
            <div className="p-4 border-b border-[#E0E3DE] bg-white rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${col.bgHeader}`}>
                    {colLeads.length}
                  </span>
                  <h3 className="font-bold text-xs text-[#2C2E2A]">{col.label}</h3>
                </div>
                <span className="text-[11px] font-mono text-[#7C8472] mt-0.5 block">
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
                  className={`p-4 rounded-xl bg-white border border-[#E0E3DE] shadow-2xs hover:shadow-xs transition cursor-grab active:cursor-grabbing space-y-2.5 ${
                    movingLeadId === lead.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 text-[#B5BBAE] shrink-0" />
                      <span className="font-bold text-xs text-[#2C2E2A] truncate">{lead.nome}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DDE8DE] text-[#2D6A4F]">
                      Score {lead.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#63695B]">
                    <span className="font-mono">{lead.telefone}</span>
                    <span className="font-mono font-bold text-[#2C2E2A]">
                      {lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}
                    </span>
                  </div>

                  {lead.utmCampaign && (
                    <div className="text-[10px] font-mono text-[#7C8472] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#E0E3DE] truncate">
                      Campanha: {lead.utmCampaign}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[#E7EBE6] text-[10px]">
                    <span className="text-[#7C8472] font-mono">{lead.origemCanal || "WhatsApp"}</span>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-bold text-[#2C2E2A] hover:text-[#7A8E75] flex items-center gap-0.5 transition"
                    >
                      <span>Ver Dossiê</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {colLeads.length === 0 && (
                <div className="py-8 text-center text-xs text-[#B5BBAE] border border-dashed border-[#E0E3DE] rounded-xl">
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
