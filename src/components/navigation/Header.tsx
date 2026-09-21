"use client";

import { useState, useEffect } from "react";
import { DemoSwitcher } from "./DemoSwitcher";
import { Sun, Moon } from "lucide-react";

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
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("omni-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("omni-theme", next);

    if (next === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <header className="h-16 border-b border-[#1e2638] bg-[#0a0d14]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{orgNome}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Modo Claro / Escuro */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          className="p-2 rounded-xl bg-[#111622] border border-[#1e2638] hover:border-[#00ddd7] text-gray-400 hover:text-white transition flex items-center gap-1.5 text-xs shadow-sm"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-gray-300">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline text-gray-700">Modo Escuro</span>
            </>
          )}
        </button>

        {/* Seletor de Demonstracao (Exibido para Super Admin) */}
        {userRole === "SUPER_ADMIN" && (
          <DemoSwitcher currentSlug={orgSlug} currentSegmento={orgSegmento} />
        )}

        {/* Perfil */}
        <div className="h-4 w-px bg-[#1e2638] mx-1" />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111622] border border-[#1e2638] text-xs">
          <div className="w-6 h-6 rounded-full bg-[#00ddd7]/20 text-[#00ddd7] flex items-center justify-center font-bold text-xs">
            {userName.charAt(0)}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-medium text-white">{userName}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
