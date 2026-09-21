"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
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
  { id: "NOVO", label: "Novos Leads", cor: "border-blue-500/40 text-blue-400", activeBg: "bg-blue-500/5 border-blue-500/40" },
  { id: "QUALIFICADO", label: "Qualificados (SQL)", cor: "border-amber-500/40 text-amber-400", activeBg: "bg-amber-500/5 border-amber-500/40" },
  { id: "AGENDADO", label: "Visita / Reunião", cor: "border-purple-500/40 text-purple-400", activeBg: "bg-purple-500/5 border-purple-500/40" },
  { id: "GANHO", label: "Venda Concluída", cor: "border-emerald-500/40 text-emerald-400", activeBg: "bg-emerald-500/5 border-emerald-500/40" },
  { id: "PERDIDO", label: "Desqualificados", cor: "border-red-500/40 text-red-400", activeBg: "bg-red-500/5 border-red-500/40" },
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

  // Handlers de Drag and Drop
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
    // Só reseta se estiver saindo do container
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
    <div className="flex gap-4 overflow-x-auto pb-4 select-none min-h-[calc(100vh-200px)]">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col.id);
        const colTotalValor = colLeads.reduce(
          (acc, l) => acc + (l.valorNegocio || 0),
          0
        );
        const isTarget = dragOverColId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`w-80 shrink-0 bg-[#0c101a] border rounded-2xl flex flex-col max-h-[calc(100vh-180px)] shadow-lg transition-all duration-150 ${
              isTarget
                ? `${col.activeBg} border-2 scale-[1.01]`
                : "border-[#1e2638]"
            }`}
          >
            {/* Header da Coluna */}
            <div className={`p-4 border-b border-[#1e2638] ${col.cor}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>{col.label}</span>
                </h3>
                <span className="text-xs font-mono font-bold bg-[#161d2d] px-2 py-0.5 rounded-full text-gray-300 border border-[#252e42]">
                  {colLeads.length}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">
                {formatCurrency(colTotalValor)}
              </div>
            </div>

            {/* Drop Zone e Lista de Cards */}
            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {colLeads.length === 0 ? (
                <div
                  className={`p-6 text-center text-[11px] rounded-xl border border-dashed transition ${
                    isTarget
                      ? "border-[#00ddd7] text-[#00ddd7] bg-[#00ddd7]/5"
                      : "text-gray-600 border-[#1e2638]"
                  }`}
                >
                  {isTarget ? "Solte o lead aqui!" : "Arraste um lead para esta etapa"}
                </div>
              ) : (
                colLeads.map((lead) => {
                  const isHot = lead.score >= 80;
                  const isDragging = draggedLeadId === lead.id;

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={() => {
                        setDraggedLeadId(null);
                        setDragOverColId(null);
                      }}
                      className={`p-4 rounded-xl bg-[#111622] border transition shadow-md group relative space-y-3 cursor-grab active:cursor-grabbing hover:border-[#2e3b54] ${
                        isDragging
                          ? "opacity-30 border-[#00ddd7] scale-95"
                          : "border-[#1e2638]"
                      }`}
                    >
                      {/* Top Lead Meta */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition mt-0.5 shrink-0" />
                          <div>
                            <Link
                              href={`/dashboard/leads/${lead.id}`}
                              className="font-bold text-xs text-white group-hover:text-[#00ddd7] transition flex items-center gap-1"
                            >
                              <span>{lead.nome}</span>
                            </Link>
                            <span className="text-[11px] text-gray-400 block font-mono mt-0.5">
                              {lead.telefone}
                            </span>
                          </div>
                        </div>

                        {/* Badge de Score */}
                        <div
                          className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] flex items-center gap-1 shrink-0 ${
                            isHot
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{lead.score}</span>
                        </div>
                      </div>

                      {/* Interesse e Valor */}
                      <div className="text-xs space-y-1 pl-5">
                        {lead.ramoInteresse && (
                          <div className="text-gray-300 font-medium truncate">
                            {lead.ramoInteresse}
                          </div>
                        )}
                        <div className="text-emerald-400 font-mono font-semibold text-xs">
                          {formatCurrency(lead.valorNegocio)}
                        </div>
                      </div>

                      {/* Origem e UTMs */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-5">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161d2d] text-gray-400 border border-[#252e42]">
                          {lead.origemCanal}
                        </span>
                        {lead.directKeyword && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
                            #{lead.directKeyword}
                          </span>
                        )}
                        {lead.utmCampaign && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00ddd7]/10 text-[#00ddd7] border border-[#00ddd7]/30 max-w-[140px] truncate">
                            {lead.utmCampaign}
                          </span>
                        )}
                      </div>

                      {/* Botões de Ação & Mudança de Estágio */}
                      <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between gap-1 pl-5">
                        <Link
                          href={`/dashboard/leads/${lead.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#161d2d] hover:bg-[#1e2638] text-[10px] text-gray-300 font-medium transition"
                        >
                          Dossiê 360°
                        </Link>

                        {/* Botão de Avanço Rápido */}
                        {col.id !== "GANHO" && (
                          <button
                            type="button"
                            disabled={movingLeadId === lead.id}
                            onClick={() => {
                              const currentIndex = COLUMNS.findIndex(
                                (c) => c.id === col.id
                              );
                              if (currentIndex < COLUMNS.length - 1) {
                                moveLead(lead.id, COLUMNS[currentIndex + 1].id);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#1c2438] hover:bg-[#00ddd7] hover:text-black text-[10px] font-medium text-gray-300 transition flex items-center gap-1"
                            title="Avançar para o próximo estágio"
                          >
                            <span>Avançar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
