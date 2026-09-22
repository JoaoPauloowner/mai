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
  { id: "NOVO", label: "Novos Leads", bgHeader: "bg-[#FFF3D6]/40 text-[#A15C00]" },
  { id: "QUALIFICADO", label: "Qualificados (SQL)", bgHeader: "bg-[#EAF7EF] text-[#247A4A]" },
  { id: "AGENDADO", label: "Visita / Reunião", bgHeader: "bg-[#F3F3F0] text-[#171717]" },
  { id: "GANHO", label: "Venda Concluída", bgHeader: "bg-[#FF6A2A] text-[#171717]" },
  { id: "PERDIDO", label: "Desqualificados", bgHeader: "bg-[#FDE8E8] text-[#B42318]" },
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
    <div className="flex gap-4 overflow-x-auto pb-4 select-none min-h-[calc(100vh-200px)] text-[#171717]">
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
            className={`w-80 shrink-0 flex flex-col rounded-2xl bg-[#F4F4F2] border transition-all ${
              isOver ? "border-[#FF6A2A] bg-[#F4F4F2]" : "border-[#E7E7E4]"
            }`}
          >
            {/* Header da Coluna */}
            <div className="p-4 border-b border-[#E7E7E4] bg-white rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${col.bgHeader}`}>
                    {colLeads.length}
                  </span>
                  <h3 className="font-bold text-xs text-[#171717]">{col.label}</h3>
                </div>
                <span className="text-[11px] font-mono text-[#8A8A84] mt-0.5 block">
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
                  className={`p-4 rounded-xl bg-white border border-[#E7E7E4] shadow-2xs hover:shadow-xs transition cursor-grab active:cursor-grabbing space-y-2.5 ${
                    movingLeadId === lead.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 text-[#B0B0AA] shrink-0" />
                      <span className="font-bold text-xs text-[#171717] truncate">{lead.nome}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF7EF] text-[#247A4A]">
                      Score {lead.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6F6F6F]">
                    <span className="font-mono">{lead.telefone}</span>
                    <span className="font-mono font-bold text-[#171717]">
                      {lead.valorNegocio ? formatCurrency(lead.valorNegocio) : "—"}
                    </span>
                  </div>

                  {lead.utmCampaign && (
                    <div className="text-[10px] font-mono text-[#8A8A84] bg-[#F4F4F2] px-2 py-0.5 rounded border border-[#E7E7E4] truncate">
                      Campanha: {lead.utmCampaign}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[#F4F4F2] text-[10px]">
                    <span className="text-[#8A8A84] font-mono">{lead.origemCanal || "WhatsApp"}</span>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-bold text-[#171717] hover:text-[#FF6A2A] flex items-center gap-0.5 transition"
                    >
                      <span>Ver Dossiê</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {colLeads.length === 0 && (
                <div className="py-8 text-center text-xs text-[#B0B0AA] border border-dashed border-[#E7E7E4] rounded-xl">
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
