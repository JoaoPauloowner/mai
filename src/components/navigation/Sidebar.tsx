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
    AUTO: { label: "Automotivo", color: "bg-[#FFF3D6] text-[#A15C00] border-[#E8D5A8]", icon: "🚗" },
    INSURANCE: { label: "Seguros", color: "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]", icon: "🛡️" },
    ACCOUNTING: { label: "Contábil", color: "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]", icon: "📊" },
    CLINIC: { label: "Saúde & Clínica", color: "bg-[#FDE8E8] text-[#B42318] border-red-200", icon: "🏥" },
    GENERAL: { label: "Multi-Vertical", color: "bg-[#F4F4F2] text-[#171717] border-[#D9D9D5]", icon: "🌐" },
  };

  const activeSegment = segmentConfig[segmento] || segmentConfig.GENERAL;

  return (
    <aside
      className={`bg-[#F4F4F2] border-r border-[#E7E7E4] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Header do Menu com Tile Lime WAct */}
      <div>
        <div className="p-4 border-b border-[#E7E7E4] flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6A2A] text-[#171717] flex items-center justify-center font-extrabold text-lg shadow-xs shrink-0 border border-[#EB5417]">
              Ω
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-[#171717] truncate">{orgNome}</h1>
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
            className="p-1.5 rounded-lg text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2] transition shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Itens de Navegação Unificados */}
        <nav className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          
          {/* 1. SEÇÃO: OPERAÇÃO & ATENDIMENTO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                Operação & Atendimento
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard/inbox"
                title="Caixa de Entrada (WhatsApp & Instagram)"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                } ${
                  isLinkActive("/dashboard/inbox")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                  {!collapsed && <span>Caixa de Entrada</span>}
                </div>
                {!collapsed && <span className="w-2 h-2 rounded-full bg-[#FF6A2A] border border-[#FF6A2A]" />}
              </Link>

              <Link
                href="/dashboard/crm"
                title="CRM Kanban & Leads"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/crm")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Kanban className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>CRM Kanban & Leads</span>}
              </Link>
            </div>
          </div>

          {/* 2. MÓDULOS ESPECÍFICOS DE NICHO */}
          {segmento === "AUTO" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#A15C00]">
                  Módulo Automotivo
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/auto/estoque"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/auto/estoque")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0 text-[#A15C00]" />
                  {!collapsed && <span>Estoque no Pátio</span>}
                </Link>

                <Link
                  href="/dashboard/auto/avaliacao-usados"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/auto/avaliacao-usados")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0 text-[#A15C00]" />
                  {!collapsed && <span>Avaliação de Troca</span>}
                </Link>

                <Link
                  href="/dashboard/auto/test-drives"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/auto/test-drives")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0 text-[#A15C00]" />
                  {!collapsed && <span>Agenda Test-Drives</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "INSURANCE" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#247A4A]">
                  Módulo Seguros
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/seguros/cotacoes"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/seguros/cotacoes")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <Scale className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Multicálculo & Cotações</span>}
                </Link>

                <Link
                  href="/dashboard/seguros/radar-renovacoes"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/seguros/radar-renovacoes")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Radar de Renovações</span>}
                </Link>

                <Link
                  href="/dashboard/seguros/ligacoes-vapi"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/seguros/ligacoes-vapi")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <PhoneCall className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Voz IA & Ligações</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "ACCOUNTING" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#247A4A]">
                  Módulo Contábil
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/contabil/guias"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/contabil/guias")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <ReceiptText className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Guias & PIX Instantâneo</span>}
                </Link>

                <Link
                  href="/dashboard/contabil/auditoria-xml"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/contabil/auditoria-xml")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Auditoria de XMLs</span>}
                </Link>

                <Link
                  href="/dashboard/contabil/helpdesk"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/contabil/helpdesk")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 shrink-0 text-[#247A4A]" />
                  {!collapsed && <span>Helpdesk Fiscal/DP</span>}
                </Link>
              </div>
            </div>
          )}

          {segmento === "CLINIC" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#B42318]">
                  Módulo Saúde & Clínica
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/clinica/consultas"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/clinica/consultas")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <Stethoscope className="w-4 h-4 shrink-0 text-[#B42318]" />
                  {!collapsed && <span>Agenda de Consultas</span>}
                </Link>

                <Link
                  href="/dashboard/clinica/no-show"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/clinica/no-show")
                      ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                      : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                  }`}
                >
                  <ClockAlert className="w-4 h-4 shrink-0 text-[#B42318]" />
                  {!collapsed && <span>Anti No-Show & Lembretes</span>}
                </Link>
              </div>
            </div>
          )}

          {/* 3. SEÇÃO: MARKETING & ATRIBUIÇÃO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                Marketing & Atribuição
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard"
                title="Torre de Atribuição (Cockpit Geral)"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  pathname === "/dashboard"
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Torre de Atribuição</span>}
              </Link>

              <Link
                href="/dashboard/campanhas"
                title="Campanhas & UTMs"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/campanhas")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Campanhas & UTMs</span>}
              </Link>

              <Link
                href="/dashboard/settings/quiz"
                title="Editor do Mini-Quiz"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/quiz")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <FileQuestion className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Editor do Mini-Quiz</span>}
              </Link>

              <Link
                href="/dashboard/importar"
                title="Importador CSV / Excel"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/importar")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Upload className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Importador CSV / Excel</span>}
              </Link>
            </div>
          </div>

          {/* 4. SEÇÃO: CANAIS & CONFIGURAÇÕES */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                Canais & Configurações
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard/settings/whatsapp"
                title="Conectar WhatsApp"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/whatsapp")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Phone className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Conectar WhatsApp</span>}
              </Link>

              <Link
                href="/dashboard/settings/instagram"
                title="Conectar Instagram Direct"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/instagram")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <InstagramIcon className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Conectar Instagram</span>}
              </Link>

              <Link
                href="/dashboard/settings/ia-prompts"
                title="Regras da IA & Áudio Humanizado"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/ia-prompts")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Regras da IA & Áudio</span>}
              </Link>

              <Link
                href="/dashboard/settings/equipe"
                title="Equipe & Vendedores (Round-Robin)"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/equipe")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Equipe & Vendedores</span>}
              </Link>

              <Link
                href="/dashboard/settings/geral"
                title="Dados da Empresa"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/geral")
                    ? "bg-white text-[#171717] font-bold shadow-xs border border-[#E7E7E4]"
                    : "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2]"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0 text-[#FF6A2A]" />
                {!collapsed && <span>Dados da Empresa</span>}
              </Link>
            </div>
          </div>

        </nav>
      </div>

      {/* Rodapé: Card Promocional Sage + Logout */}
      <div className="p-3 border-t border-[#E7E7E4] space-y-3">
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-[#FF6A2A] text-white space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>🛡️ No Walls, No Limits</span>
            </div>
            <p className="text-[11px] text-[#F4F4F2] leading-tight">
              Acesso comercial ilimitado com IA e atribuição reversa.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E7E7E4]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#F3F3F0] text-[#171717] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D9D9D5]">
              {role.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#171717] block truncate">{role}</span>
                <span className="text-[10px] text-[#8A8A84] block truncate">Operação Ativa</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-1.5 text-[#6F6F6F] hover:text-red-600 transition rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
