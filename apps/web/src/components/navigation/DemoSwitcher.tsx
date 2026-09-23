"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

interface DemoSwitcherProps {
  currentSlug: string;
  currentSegmento: string;
}

const DEMO_TENANTS = [
  { slug: "omni-demo", nome: "Omni Growth Hub", segmento: "GENERAL", icone: "🌐" },
  { slug: "autoprime", nome: "AutoPrime Seminovos", segmento: "AUTO", icone: "🚗" },
  { slug: "apex-seguros", nome: "Apex Corretora", segmento: "INSURANCE", icone: "🛡️" },
  { slug: "odontoprev", nome: "OdontoPrev Estética", segmento: "CLINIC", icone: "🏥" },
];

export function DemoSwitcher({ currentSlug }: DemoSwitcherProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const switchTenant = async (targetSlug: string) => {
    if (targetSlug === currentSlug) {
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetSlug }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error("Falha ao alternar nicho de demo", e);
    } finally {
      setLoading(false);
    }
  };

  const activeDemo = DEMO_TENANTS.find((d) => d.slug === currentSlug) || DEMO_TENANTS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800"
      >
        <span className="text-neutral-500 font-mono text-[10px]">Nicho:</span>
        <span className="flex items-center gap-1 font-medium">
          <span>{activeDemo.icone}</span>
          <span>{activeDemo.nome}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-56 rounded bg-white border border-neutral-200 shadow-lg z-50 p-1 space-y-0.5">
            <div className="px-2 py-1 text-[10px] uppercase font-mono text-neutral-400">
              Alternar Nicho Demo
            </div>
            {DEMO_TENANTS.map((tenant) => {
              const isSelected = tenant.slug === currentSlug;
              return (
                <button
                  key={tenant.slug}
                  onClick={() => switchTenant(tenant.slug)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition ${
                    isSelected
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{tenant.icone}</span>
                    <span className="truncate">{tenant.nome}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
