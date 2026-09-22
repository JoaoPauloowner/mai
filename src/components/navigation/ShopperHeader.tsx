"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DemoSwitcher } from "./DemoSwitcher";
import { ChevronDown, Download } from "lucide-react";

interface HeaderProps {
  userName: string;
  userRole: string;
  orgSlug: string;
  orgSegmento: string;
  orgNome: string;
  isDemoMode: boolean;
}

export function Header({
  userName,
  userRole,
  orgSlug,
  orgSegmento,
  orgNome,
  isDemoMode,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const periodo = (searchParams.get("period") as "7d" | "30d" | "3m" | "6m" | "1y") || "30d";

  const setPeriodo = (p: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", p);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    window.open(`/api/export/leads?period=${periodo}`, "_blank");
  };

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Título & Status */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <span>{orgNome}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-[#EFF6FF] text-[#2563EB] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" /> Live Attribution
          </span>
        </h2>
      </div>

      {/* Controles WAct [VISTO NO BEHANCE: Segmented Period, Sources Dropdown, Export] */}
      <div className="flex items-center gap-3">
        
        {/* Segmented Control de Período (com item ativo escuro) */}
        <div className="hidden sm:flex items-center bg-[#F8FAFC] p-1 rounded-xl text-xs font-semibold text-[#64748B] border border-[#CBD5E1]">
          {(["7d", "30d", "3m", "6m", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 rounded-lg transition ${
                periodo === p
                  ? "bg-[#0F172A] text-white font-bold shadow-sm"
                  : "hover:text-[#0F172A]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Dropdown All Sources */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm">
          <span>All sources</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </button>

        {/* Botão Export — abre CSV real */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm transition"
          title={`Exportar leads dos últimos ${periodo}`}
        >
          <Download className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Export</span>
        </button>

        {/* Seletor de Demonstração (Super Admin) */}
        {userRole === "SUPER_ADMIN" && (
          <DemoSwitcher currentSlug={orgSlug} currentSegmento={orgSegmento} />
        )}

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-[#0F172A] flex items-center justify-center font-bold text-xs border border-[#1D4ED8] shadow-sm">
          {userName.charAt(0)}
        </div>

      </div>
    </header>
  );
}
