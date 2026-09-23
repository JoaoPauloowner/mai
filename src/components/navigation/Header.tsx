"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DemoSwitcher } from "./DemoSwitcher";
import { Download } from "lucide-react";

interface HeaderProps {
  userName: string;
  userRole: string;
  orgSlug: string;
  orgSegmento: string;
  orgNome: string;
  isDemoMode: boolean;
}

export function Header({
  orgSlug,
  orgSegmento,
  orgNome,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const periodo = searchParams.get("period") || "30d";

  const setPeriodo = (p: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", p);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    window.open(`/api/export/leads?period=${periodo}`, "_blank");
  };

  return (
    <header className="h-14 border-b border-neutral-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm text-neutral-900">{orgNome}</span>
        <span className="text-xs text-neutral-500 font-mono">({orgSegmento})</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Seletor de Período Funcional */}
        <div className="flex border border-neutral-200 rounded text-xs overflow-hidden">
          {(["7d", "30d", "3m", "6m", "1y"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriodo(p)}
              className={`px-2.5 py-1 ${
                periodo === p ? "bg-neutral-900 text-white font-medium" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded text-xs text-neutral-700 hover:bg-neutral-50 font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>

        <DemoSwitcher currentSlug={orgSlug} currentSegmento={orgSegmento} />
      </div>
    </header>
  );
}
