"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Target,
  Upload,
  Settings,
  LogOut,
  Car,
  FileCheck2,
  CalendarDays,
  ShieldCheck,
  PhoneCall,
  Scale,
  ReceiptText,
  FileText,
  LifeBuoy,
  Stethoscope,
  ClockAlert,
  Phone,
  FileQuestion,
  Users,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface SidebarProps {
  segmento: string;
  orgNome: string;
  role: string;
}

export function Sidebar({ segmento, orgNome }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    geral: true,
    auto: true,
    seguros: true,
    contabil: true,
    clinica: true,
    settings: false,
  });

  // Load persistence preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("omnisdr_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("omnisdr_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isLinkActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    const active = isLinkActive(path);
    return `flex items-center ${
      isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"
    } rounded text-sm transition-colors ${
      active
        ? "bg-neutral-900 text-white font-medium shadow-sm"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-white border-r border-neutral-200 flex flex-col shrink-0 z-30 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between shrink-0">
        {!isCollapsed ? (
          <div className="min-w-0 flex-1">
            <div className="font-bold text-base text-neutral-900 tracking-tight flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              MAI
            </div>
            <div className="text-xs text-neutral-500 truncate" title={orgNome || "Workspace"}>
              {orgNome || "Workspace"}
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center pb-0.5">
            <span className="font-bold text-base text-neutral-900 tracking-tight">M</span>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className={`p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition ${
            isCollapsed ? "mx-auto mt-2" : ""
          }`}
          aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-4">
        {/* Core */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button
              onClick={() => toggleSection("geral")}
              className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
            >
              <span>Geral</span>
              {openSections.geral ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="h-px bg-neutral-200 my-1 mx-2" />
          )}

          {(isCollapsed || openSections.geral) && (
            <div className="space-y-0.5">
              <Link href="/dashboard" className={navLinkClass("/dashboard")} title="Visão Geral">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Visão Geral</span>}
              </Link>
              <Link href="/dashboard/crm" className={navLinkClass("/dashboard/crm")} title="Pipeline CRM">
                <Kanban className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Pipeline CRM</span>}
              </Link>
              <Link href="/dashboard/inbox" className={navLinkClass("/dashboard/inbox")} title="Chat Unificado">
                <MessageSquare className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Chat Unificado</span>}
              </Link>
              <Link href="/dashboard/campanhas" className={navLinkClass("/dashboard/campanhas")} title="Campanhas">
                <Target className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Campanhas</span>}
              </Link>
              <Link href="/dashboard/importar" className={navLinkClass("/dashboard/importar")} title="Importar Leads">
                <Upload className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Importar Leads</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Vertical Auto */}
        {(segmento === "AUTO" || segmento === "GERAL") && (
          <div className="space-y-1">
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection("auto")}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
              >
                <span>Automotivo</span>
                {openSections.auto ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="h-px bg-neutral-200 my-1 mx-2" />
            )}

            {(isCollapsed || openSections.auto) && (
              <div className="space-y-0.5">
                <Link href="/dashboard/auto/estoque" className={navLinkClass("/dashboard/auto/estoque")} title="Estoque">
                  <Car className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Estoque</span>}
                </Link>
                <Link href="/dashboard/auto/avaliacao-usados" className={navLinkClass("/dashboard/auto/avaliacao-usados")} title="Avaliação Usados">
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Avaliação Usados</span>}
                </Link>
                <Link href="/dashboard/auto/test-drives" className={navLinkClass("/dashboard/auto/test-drives")} title="Test-Drives">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Test-Drives</span>}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Vertical Seguros */}
        {(segmento === "SEGUROS" || segmento === "GERAL") && (
          <div className="space-y-1">
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection("seguros")}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
              >
                <span>Seguros</span>
                {openSections.seguros ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="h-px bg-neutral-200 my-1 mx-2" />
            )}

            {(isCollapsed || openSections.seguros) && (
              <div className="space-y-0.5">
                <Link href="/dashboard/seguros/cotacoes" className={navLinkClass("/dashboard/seguros/cotacoes")} title="Cotações">
                  <Scale className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Cotações</span>}
                </Link>
                <Link href="/dashboard/seguros/radar-renovacoes" className={navLinkClass("/dashboard/seguros/radar-renovacoes")} title="Renovações">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Renovações</span>}
                </Link>
                <Link href="/dashboard/seguros/ligacoes-vapi" className={navLinkClass("/dashboard/seguros/ligacoes-vapi")} title="Voz Vapi">
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Voz Vapi</span>}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Vertical Contabil */}
        {(segmento === "CONTABIL" || segmento === "GERAL") && (
          <div className="space-y-1">
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection("contabil")}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
              >
                <span>Contábil</span>
                {openSections.contabil ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="h-px bg-neutral-200 my-1 mx-2" />
            )}

            {(isCollapsed || openSections.contabil) && (
              <div className="space-y-0.5">
                <Link href="/dashboard/contabil/guias" className={navLinkClass("/dashboard/contabil/guias")} title="Guias Tributárias">
                  <ReceiptText className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Guias Tributárias</span>}
                </Link>
                <Link href="/dashboard/contabil/auditoria-xml" className={navLinkClass("/dashboard/contabil/auditoria-xml")} title="Auditoria XML">
                  <FileText className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Auditoria XML</span>}
                </Link>
                <Link href="/dashboard/contabil/helpdesk" className={navLinkClass("/dashboard/contabil/helpdesk")} title="Helpdesk">
                  <LifeBuoy className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Helpdesk</span>}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Vertical Clinica */}
        {(segmento === "CLINICA" || segmento === "GERAL") && (
          <div className="space-y-1">
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection("clinica")}
                className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
              >
                <span>Clínica</span>
                {openSections.clinica ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="h-px bg-neutral-200 my-1 mx-2" />
            )}

            {(isCollapsed || openSections.clinica) && (
              <div className="space-y-0.5">
                <Link href="/dashboard/clinica/consultas" className={navLinkClass("/dashboard/clinica/consultas")} title="Consultas">
                  <Stethoscope className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Consultas</span>}
                </Link>
                <Link href="/dashboard/clinica/no-show" className={navLinkClass("/dashboard/clinica/no-show")} title="Anti No-Show">
                  <ClockAlert className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Anti No-Show</span>}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Configurações */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button
              onClick={() => toggleSection("settings")}
              className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1 hover:text-neutral-700 transition"
            >
              <span>Configurações</span>
              {openSections.settings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="h-px bg-neutral-200 my-1 mx-2" />
          )}

          {(isCollapsed || openSections.settings) && (
            <div className="space-y-0.5">
              <Link href="/dashboard/settings/whatsapp" className={navLinkClass("/dashboard/settings/whatsapp")} title="WhatsApp">
                <Phone className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>WhatsApp</span>}
              </Link>
              <Link href="/dashboard/settings/instagram" className={navLinkClass("/dashboard/settings/instagram")} title="Instagram">
                <InstagramIcon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Instagram</span>}
              </Link>
              <Link href="/dashboard/settings/ia-prompts" className={navLinkClass("/dashboard/settings/ia-prompts")} title="Prompts IA">
                <Settings className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Prompts IA</span>}
              </Link>
              <Link href="/dashboard/settings/equipe" className={navLinkClass("/dashboard/settings/equipe")} title="Equipe">
                <Users className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Equipe</span>}
              </Link>
              <Link href="/dashboard/settings/quiz" className={navLinkClass("/dashboard/settings/quiz")} title="Quiz Captação">
                <FileQuestion className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Quiz Captação</span>}
              </Link>
              <Link href="/dashboard/settings/geral" className={navLinkClass("/dashboard/settings/geral")} title="Geral">
                <Settings className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Geral</span>}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-2.5 border-t border-neutral-200 shrink-0 bg-white">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          title="Sair da conta"
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2"
          } rounded text-sm text-red-600 hover:bg-red-50 transition`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

