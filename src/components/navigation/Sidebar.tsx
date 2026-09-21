"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  FileSpreadsheet,
  Settings,
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
  LogOut,
  Target,
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  Users,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface SidebarProps {
  segmento: string;
  orgNome: string;
  role: string;
}

export function Sidebar({ segmento, orgNome, role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // Badge de Nicho Ativo
  const segmentConfig: Record<string, { label: string; color: string; icon: string }> = {
    AUTO: { label: "Automotivo", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: "🚗" },
    INSURANCE: { label: "Seguros", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "🛡️" },
    ACCOUNTING: { label: "Contabil", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "📊" },
    CLINIC: { label: "Saude & Clinica", color: "bg-pink-500/10 text-pink-400 border-pink-500/30", icon: "🏥" },
    GENERAL: { label: "Multi-Vertical", color: "bg-[#00ddd7]/10 text-[#00ddd7] border-[#00ddd7]/30", icon: "🌐" },
  };

  const activeSegment = segmentConfig[segmento] || segmentConfig.GENERAL;

  return (
    <aside
      className={`bg-[#0a0d14] border-r border-[#1e2638] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Header do Menu */}
      <div>
        <div className="p-4 border-b border-[#1e2638] flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(0,221,215,0.3)] shrink-0">
              Ω
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-white truncate">{orgNome}</h1>
                <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-full font-mono mt-0.5 ${activeSegment.color}`}>
                  <span>{activeSegment.icon}</span> {activeSegment.label}
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#161d2d] transition shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Itens de Navegacao Unificados */}
        <nav className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* 1. SECAO: OPERACAO & ATENDIMENTO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                Operacao & Atendimento
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard/inbox"
                title="Caixa de Entrada (WhatsApp & Instagram)"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                } ${
                  isLinkActive("/dashboard/inbox")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Caixa de Entrada</span>}
                </div>
                {!collapsed && <span className="w-2 h-2 rounded-full bg-[#00ddd7] animate-pulse" />}
              </Link>

              <Link
                href="/dashboard/crm"
                title="CRM Kanban & Leads"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/crm")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Kanban className="w-4 h-4 shrink-0" />
                {!collapsed && <span>CRM Kanban & Leads</span>}
              </Link>

              {/* Itens de Operacao Especificos de Nicho (Integrados Diretamente) */}
              {segmento === "AUTO" && (
                <>
                  <Link
                    href="/dashboard/auto/estoque"
                    title="Estoque no Patio"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/auto/estoque")
                        ? "bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <Car className="w-4 h-4 shrink-0 text-amber-400" />
                    {!collapsed && <span>Estoque no Patio</span>}
                  </Link>

                  <Link
                    href="/dashboard/auto/avaliacao-usados"
                    title="Avaliacao de Troca (Vision)"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/auto/avaliacao-usados")
                        ? "bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 shrink-0 text-amber-400" />
                    {!collapsed && <span>Avaliacao de Troca</span>}
                  </Link>

                  <Link
                    href="/dashboard/auto/test-drives"
                    title="Agenda Test-Drives"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/auto/test-drives")
                        ? "bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4 shrink-0 text-amber-400" />
                    {!collapsed && <span>Agenda Test-Drives</span>}
                  </Link>
                </>
              )}

              {segmento === "INSURANCE" && (
                <>
                  <Link
                    href="/dashboard/seguros/radar-renovacoes"
                    title="Radar de Renovacoes"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/seguros/radar-renovacoes")
                        ? "bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    {!collapsed && <span>Radar de Renovacoes</span>}
                  </Link>

                  <Link
                    href="/dashboard/seguros/cotacoes"
                    title="Multicalculo Seguradoras"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/seguros/cotacoes")
                        ? "bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <Scale className="w-4 h-4 shrink-0 text-blue-400" />
                    {!collapsed && <span>Multicalculo Seguradoras</span>}
                  </Link>

                  <Link
                    href="/dashboard/seguros/ligacoes-vapi"
                    title="Ligacoes Voz Vapi.ai"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/seguros/ligacoes-vapi")
                        ? "bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <PhoneCall className="w-4 h-4 shrink-0 text-blue-400" />
                    {!collapsed && <span>Ligacoes Voz Vapi.ai</span>}
                  </Link>
                </>
              )}

              {segmento === "ACCOUNTING" && (
                <>
                  <Link
                    href="/dashboard/contabil/guias"
                    title="Guias com PIX"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/contabil/guias")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <ReceiptText className="w-4 h-4 shrink-0 text-emerald-400" />
                    {!collapsed && <span>Guias com PIX</span>}
                  </Link>

                  <Link
                    href="/dashboard/contabil/auditoria-xml"
                    title="Auditoria XML & NFs"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/contabil/auditoria-xml")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-emerald-400" />
                    {!collapsed && <span>Auditoria XML & NFs</span>}
                  </Link>

                  <Link
                    href="/dashboard/contabil/helpdesk"
                    title="Helpdesk Departamental"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/contabil/helpdesk")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <LifeBuoy className="w-4 h-4 shrink-0 text-emerald-400" />
                    {!collapsed && <span>Helpdesk Departamental</span>}
                  </Link>
                </>
              )}

              {segmento === "CLINIC" && (
                <>
                  <Link
                    href="/dashboard/clinica/consultas"
                    title="Agenda Consultas"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/clinica/consultas")
                        ? "bg-pink-500/10 text-pink-400 font-semibold border border-pink-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 shrink-0 text-pink-400" />
                    {!collapsed && <span>Agenda Consultas</span>}
                  </Link>

                  <Link
                    href="/dashboard/clinica/no-show"
                    title="Prevencao No-Show"
                    className={`flex items-center rounded-lg text-xs font-medium transition ${
                      collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                    } ${
                      isLinkActive("/dashboard/clinica/no-show")
                        ? "bg-pink-500/10 text-pink-400 font-semibold border border-pink-500/30"
                        : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                    }`}
                  >
                    <ClockAlert className="w-4 h-4 shrink-0 text-pink-400" />
                    {!collapsed && <span>Prevencao No-Show</span>}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 2. SECAO: MARKETING & ATRIBUICAO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#00ddd7]">
                Marketing & Atribuicao
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard"
                title="Torre de Atribuicao (ROI)"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Torre de Atribuicao</span>}
              </Link>

              <Link
                href="/dashboard/campanhas"
                title="Campanhas & UTMs / Direct"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/campanhas")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Campanhas & UTMs</span>}
              </Link>

              <Link
                href="/dashboard/settings/quiz"
                title="Editor do Mini-Quiz"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/quiz")
                    ? "bg-[#1c2438] text-purple-400 font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <FileQuestion className="w-4 h-4 shrink-0 text-purple-400" />
                {!collapsed && <span>Editor do Mini-Quiz</span>}
              </Link>

              <Link
                href="/dashboard/importar"
                title="Importador CSV / Excel"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/importar")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Importador CSV / Excel</span>}
              </Link>
            </div>
          </div>

          {/* 3. SECAO: CANAIS & CONFIGURACOES */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                Canais & Configuracoes
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard/settings/whatsapp"
                title="Conectar WhatsApp (QR / Meta)"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/whatsapp")
                    ? "bg-[#1c2438] text-emerald-400 font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                {!collapsed && <span>Conectar WhatsApp</span>}
              </Link>

              <Link
                href="/dashboard/settings/instagram"
                title="Conectar Instagram Direct"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/instagram")
                    ? "bg-[#1c2438] text-pink-400 font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                {!collapsed && <span>Conectar Instagram</span>}
              </Link>

              <Link
                href="/dashboard/settings/geral"
                title="Telefone & Perfil da Empresa"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/geral")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Telefone & Perfil</span>}
              </Link>

              <Link
                href="/dashboard/settings/ia-prompts"
                title="Regras da IA & Audio PTT"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/ia-prompts")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#00ddd7] shrink-0" />
                {!collapsed && <span>Regras da IA & Audio</span>}
              </Link>

              <Link
                href="/dashboard/settings/equipe"
                title="Equipe & Vendedores"
                className={`flex items-center rounded-lg text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/equipe")
                    ? "bg-[#1c2438] text-[#00ddd7] font-semibold border border-[#2e3b54]"
                    : "text-gray-400 hover:text-white hover:bg-[#161d2d]"
                }`}
              >
                <Users className="w-4 h-4 text-[#00ddd7] shrink-0" />
                {!collapsed && <span>Equipe & Vendedores</span>}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-2.5 border-t border-[#1e2638]">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleLogout}
              title="Sair da Plataforma"
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-[#111622] border border-[#1e2638] flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{orgNome}</div>
              <div className="text-[10px] text-gray-500 font-mono truncate">{role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sair da Plataforma"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
