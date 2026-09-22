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
    AUTO: { label: "Automotivo", color: "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]", icon: "🚗" },
    INSURANCE: { label: "Seguros", color: "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]", icon: "🛡️" },
    ACCOUNTING: { label: "Contábil", color: "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]", icon: "📊" },
    CLINIC: { label: "Saúde & Clínica", color: "bg-[#E9BEC4] text-[#9B2226] border-red-200", icon: "🏥" },
    GENERAL: { label: "Multi-Vertical", color: "bg-[#E7EBE6] text-[#2C2E2A] border-[#D0D5CD]", icon: "🌐" },
  };

  const activeSegment = segmentConfig[segmento] || segmentConfig.GENERAL;

  return (
    <aside
      className={`bg-[#F5F5F5] border-r border-[#E0E3DE] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Header do Menu com Tile Lime WAct */}
      <div>
        <div className="p-4 border-b border-[#E0E3DE] flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#C1ED84] text-[#2C2E2A] flex items-center justify-center font-extrabold text-lg shadow-xs shrink-0 border border-[#B2E372]">
              Ω
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-[#2C2E2A] truncate">{orgNome}</h1>
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
            className="p-1.5 rounded-lg text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6] transition shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Itens de Navegação Unificados */}
        <nav className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          
          {/* 1. SEÇÃO: OPERAÇÃO & ATENDIMENTO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
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
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                  {!collapsed && <span>Caixa de Entrada</span>}
                </div>
                {!collapsed && <span className="w-2 h-2 rounded-full bg-[#C1ED84] border border-[#7A8E75]" />}
              </Link>

              <Link
                href="/dashboard/crm"
                title="CRM Kanban & Leads"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/crm")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Kanban className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>CRM Kanban & Leads</span>}
              </Link>
            </div>
          </div>

          {/* 2. MÓDULOS ESPECÍFICOS DE NICHO */}
          {segmento === "AUTO" && (
            <div>
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8F5D18]">
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
                      ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                      : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0 text-[#8F5D18]" />
                  {!collapsed && <span>Estoque no Pátio</span>}
                </Link>

                <Link
                  href="/dashboard/auto/avaliacao-usados"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/auto/avaliacao-usados")
                      ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                      : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0 text-[#8F5D18]" />
                  {!collapsed && <span>Avaliação de Troca</span>}
                </Link>

                <Link
                  href="/dashboard/auto/test-drives"
                  className={`flex items-center rounded-xl text-xs font-medium transition ${
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                  } ${
                    isLinkActive("/dashboard/auto/test-drives")
                      ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                      : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0 text-[#8F5D18]" />
                  {!collapsed && <span>Agenda Test-Drives</span>}
                </Link>
              </div>
            </div>
          )}

          {/* 3. SEÇÃO: MARKETING & ATRIBUIÇÃO */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
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
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Torre de Atribuição</span>}
              </Link>

              <Link
                href="/dashboard/settings/campanhas"
                title="Campanhas & UTMs"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/campanhas")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Campanhas & UTMs</span>}
              </Link>

              <Link
                href="/dashboard/quiz/editor"
                title="Editor do Mini-Quiz"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/quiz/editor")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <FileQuestion className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Editor do Mini-Quiz</span>}
              </Link>

              <Link
                href="/dashboard/importar"
                title="Importador CSV / Excel"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/importar")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Upload className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Importador CSV / Excel</span>}
              </Link>
            </div>
          </div>

          {/* 4. SEÇÃO: CANAIS & CONFIGURAÇÕES */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
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
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Phone className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Conectar WhatsApp</span>}
              </Link>

              <Link
                href="/dashboard/settings/instagram"
                title="Conectar Instagram Direct"
                className={`flex items-center rounded-xl text-xs font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/instagram")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <InstagramIcon className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Conectar Instagram</span>}
              </Link>

              <Link
                href="/dashboard/settings/regras"
                title="Regras da IA & Áudio Humanizado"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/regras")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Regras da IA & Áudio</span>}
              </Link>

              <Link
                href="/dashboard/settings/equipe"
                title="Equipe & Vendedores (Round-Robin)"
                className={`flex items-center rounded-xl font-medium text-xs transition ${
                  collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/equipe")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-xs border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Equipe & Vendedores</span>}
              </Link>
            </div>
          </div>

        </nav>
      </div>

      {/* Rodapé: Card Promocional Sage + Logout */}
      <div className="p-3 border-t border-[#E0E3DE] space-y-3">
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-[#7A8E75] text-white space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>🛡️ No Walls, No Limits</span>
            </div>
            <p className="text-[11px] text-[#E7EBE6] leading-tight">
              Acesso comercial ilimitado com IA e atribuição reversa.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E0E3DE]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D0D5CD]">
              {role.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#2C2E2A] block truncate">{role}</span>
                <span className="text-[10px] text-[#7C8472] block truncate">Operação Ativa</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-1.5 text-[#63695B] hover:text-red-600 transition rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
