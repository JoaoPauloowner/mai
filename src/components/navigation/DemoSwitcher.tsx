"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ChevronDown } from "lucide-react";

interface DemoSwitcherProps {
  currentSlug: string;
  currentSegmento: string;
}

const DEMO_TENANTS = [
  { slug: "omni-demo", nome: "Omni Growth Hub", segmento: "GENERAL", icone: "🌐", cor: "#00ddd7" },
  { slug: "autoprime", nome: "AutoPrime Seminovos", segmento: "AUTO", icone: "🚗", cor: "#f59e0b" },
  { slug: "apex-seguros", nome: "Apex Corretora", segmento: "INSURANCE", icone: "🛡️", cor: "#3b82f6" },
  { slug: "odontoprev", nome: "OdontoPrev Estética", segmento: "CLINIC", icone: "🏥", cor: "#ec4899" },
];

export function DemoSwitcher({ currentSlug, currentSegmento }: DemoSwitcherProps) {
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161d2d] border border-[#2e3b54] hover:border-[#00ddd7] transition text-xs font-medium text-white shadow-sm"
      >
        <span className="flex items-center gap-1.5 text-[#00ddd7]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono uppercase text-[10px] text-gray-400">Demo Nicho:</span>
        </span>
        <span className="flex items-center gap-1 font-semibold">
          <span>{activeDemo.icone}</span>
          <span>{activeDemo.nome}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111622] border border-[#1e2638] shadow-2xl z-50 p-2 space-y-1">
            <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-gray-400">
              Alternar Visão de Demonstração (Super Admin)
            </div>
            {DEMO_TENANTS.map((tenant) => {
              const isSelected = tenant.slug === currentSlug;
              return (
                <button
                  key={tenant.slug}
                  onClick={() => switchTenant(tenant.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                    isSelected
                      ? "bg-[#1c2438] text-white font-semibold border border-[#2e3b54]"
                      : "text-gray-300 hover:bg-[#161d2d] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tenant.icone}</span>
                    <div className="text-left">
                      <div>{tenant.nome}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{tenant.segmento}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00ddd7]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
