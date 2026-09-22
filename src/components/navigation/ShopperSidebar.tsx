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
  Compass,
  Upload,
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
    if (href === "/shoppers/dashboard") {
      return pathname === "/shoppers/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // Badge de Nicho Ativo
  const segmentConfig: Record<string, { label: string; color: string; icon: string }> = {
    AUTO: { label: "Automotivo", color: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]", icon: "🚗" },
    INSURANCE: { label: "Seguros", color: "bg-[#EFF6FF] text-[#2563EB] border-[#C8E5D1]", icon: "🛡️" },
    ACCOUNTING: { label: "Contábil", color: "bg-[#EFF6FF] text-[#2563EB] border-[#C8E5D1]", icon: "📊" },
    CLINIC: { label: "Saúde & Clínica", color: "bg-[#FEF2F2] text-[#DC2626] border-red-200", icon: "🏥" },
    GENERAL: { label: "Multi-Vertical", color: "bg-[#F8FAFC] text-[#0F172A] border-[#CBD5E1]", icon: "🌐" },
  };

  const activeSegment = segmentConfig[segmento] || segmentConfig.GENERAL;

  return (
    <aside
      className={`bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Header do Menu com Tile Lime WAct */}
      <div>
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
          <Link href="/shoppers/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-[#0F172A] flex items-center justify-center font-extrabold text-lg shadow-xs shrink-0 border border-[#1D4ED8]">
              Ω
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-[#0F172A] truncate">{orgNome}</h1>
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
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Itens de Navegação Unificados */}
        <nav className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          
          {/* 1. SEÇÃO: OPERAÇÃO & ATENDIMENTO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Operação & Atendimento
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/shoppers/dashboard/inbox"
                title="Caixa de Entrada (WhatsApp & Instagram)"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/inbox")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Caixa de Entrada</span>}
                </div>
                {!collapsed && <span className="w-2 h-2 rounded-full bg-[#2563EB] border border-[#2563EB]" />}
              </Link>

              <Link
                href="/shoppers/dashboard/crm"
                title="CRM Kanban & Leads"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/crm")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Kanban className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>CRM Kanban & Leads</span>}
              </Link>
            </div>
          </div>

          {/* 2. MÓDULOS ESPECÍFICOS DE NICHO */}
          {segmento === "AUTO" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                  Módulo Automotivo
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/shoppers/dashboard/auto/estoque"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/auto/estoque")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0 text-[#1D4ED8]" />
                  {!collapsed && <span>Estoque no Pátio</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/auto/avaliacao-usados"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/auto/avaliacao-usados")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0 text-[#1D4ED8]" />
                  {!collapsed && <span>Avaliação de Troca</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/auto/test-drives"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/auto/test-drives")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0 text-[#1D4ED8]" />
                  {!collapsed && <span>Agenda Test-Drives</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "INSURANCE" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                  Módulo Seguros
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/shoppers/dashboard/seguros/cotacoes"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/seguros/cotacoes")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Scale className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Multicálculo & Cotações</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/seguros/radar-renovacoes"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/seguros/radar-renovacoes")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Radar de Renovações</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/seguros/ligacoes-vapi"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/seguros/ligacoes-vapi")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <PhoneCall className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Voz IA & Ligações</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "ACCOUNTING" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                  Módulo Contábil
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/shoppers/dashboard/contabil/guias"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/contabil/guias")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <ReceiptText className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Guias & PIX Instantâneo</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/contabil/auditoria-xml"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/contabil/auditoria-xml")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Auditoria de XMLs</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/contabil/helpdesk"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/contabil/helpdesk")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 shrink-0 text-[#2563EB]" />
                  {!collapsed && <span>Helpdesk Fiscal/DP</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "CLINIC" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
                  Módulo Saúde & Clínica
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/shoppers/dashboard/clinica/consultas"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/clinica/consultas")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Stethoscope className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  {!collapsed && <span>Agenda de Consultas</span>}
                </Link>

                <Link
                  href="/shoppers/dashboard/clinica/no-show"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/shoppers/dashboard/clinica/no-show")
                      ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <ClockAlert className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  {!collapsed && <span>Anti No-Show & Lembretes</span>}
                </Link>
              </div>
            </div>
          )}

          {/* 3. SEÇÃO: MARKETING & ATRIBUIÇÃO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Marketing & Atribuição
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/shoppers/dashboard"
                title="Torre de Atribuição (Cockpit Geral)"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  pathname === "/shoppers/dashboard"
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Torre de Atribuição</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/campanhas"
                title="Campanhas & UTMs"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/campanhas")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Campanhas & UTMs</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/settings/quiz"
                title="Editor do Mini-Quiz"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/quiz")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <FileQuestion className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Editor do Mini-Quiz</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/importar"
                title="Importador CSV / Excel"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/importar")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Upload className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Importador CSV / Excel</span>}
              </Link>
            </div>
          </div>

          {/* 4. SEÇÃO: CANAIS & CONFIGURAÇÕES */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Canais & Configurações
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/shoppers/dashboard/settings/whatsapp"
                title="Conectar WhatsApp"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/whatsapp")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Phone className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Conectar WhatsApp</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/settings/instagram"
                title="Conectar Instagram Direct"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/instagram")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <InstagramIcon className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Conectar Instagram</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/settings/ia-prompts"
                title="Regras da IA & Áudio Humanizado"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/ia-prompts")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Regras da IA & Áudio</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/settings/equipe"
                title="Equipe & Vendedores (Round-Robin)"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/equipe")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Equipe & Vendedores</span>}
              </Link>

              <Link
                href="/shoppers/dashboard/settings/geral"
                title="Dados da Empresa"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/shoppers/dashboard/settings/geral")
                    ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0 text-[#2563EB]" />
                {!collapsed && <span>Dados da Empresa</span>}
              </Link>
            </div>
          </div>

        </nav>
      </div>

      {/* Rodapé: Card Promocional Sage + Logout */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-3">
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-[#2563EB] text-white space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>🛡️ No Walls, No Limits</span>
            </div>
            <p className="text-[11px] text-[#F8FAFC] leading-tight">
              Acesso comercial ilimitado com IA e atribuição reversa.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E2E8F0]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#0F172A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#CBD5E1]">
              {role.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#0F172A] block truncate">{role}</span>
                <span className="text-[10px] text-[#64748B] block truncate">Operação Ativa</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-1.5 text-[#64748B] hover:text-red-600 transition rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
