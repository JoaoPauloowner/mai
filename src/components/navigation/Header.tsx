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
    <header className="h-16 border-b border-[#E7E7E4] bg-[#F4F4F2] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Título & Status */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
          <span>{orgNome}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-[#EAF7EF] text-[#247A4A] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#247A4A] animate-pulse" /> Live Attribution
          </span>
        </h2>
      </div>

      {/* Controles WAct [VISTO NO BEHANCE: Segmented Period, Sources Dropdown, Export] */}
      <div className="flex items-center gap-3">
        
        {/* Segmented Control de Período (com item ativo escuro) */}
        <div className="hidden sm:flex items-center bg-[#F4F4F2] p-1 rounded-xl text-xs font-semibold text-[#6F6F6F] border border-[#D9D9D5]">
          {(["7d", "30d", "3m", "6m", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 rounded-lg transition ${
                periodo === p
                  ? "bg-[#171717] text-white font-bold shadow-sm"
                  : "hover:text-[#171717]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Dropdown All Sources */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E7E7E4] text-xs font-semibold text-[#171717] hover:bg-[#FAFAFA] shadow-sm">
          <span>All sources</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A84]" />
        </button>

        {/* Botão Export — abre CSV real */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E7E4] text-xs font-bold text-[#171717] hover:bg-[#FAFAFA] shadow-sm transition"
          title={`Exportar leads dos últimos ${periodo}`}
        >
          <Download className="w-3.5 h-3.5 text-[#FF6A2A]" />
          <span>Export</span>
        </button>

        {/* Seletor de Demonstração (Super Admin) */}
        {userRole === "SUPER_ADMIN" && (
          <DemoSwitcher currentSlug={orgSlug} currentSegmento={orgSegmento} />
        )}

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#FF6A2A] text-[#171717] flex items-center justify-center font-bold text-xs border border-[#EB5417] shadow-sm">
          {userName.charAt(0)}
        </div>

      </div>
    </header>
  );
}
