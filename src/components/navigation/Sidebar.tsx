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
  BarChart3,
  TrendingUp,
  Sliders,
  Share2,
  Radio,
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

  return (
    <aside
      className={`bg-[#F5F5F5] border-r border-[#E0E3DE] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* 1. Header do Workspace (Logo WAct + Tile Lime + Telefone) */}
      <div>
        <div className="p-4 border-b border-[#E0E3DE] flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            {/* Tile Lime com Ícone de Conversão */}
            <div className="w-10 h-10 rounded-2xl bg-[#C1ED84] text-[#2C2E2A] flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-[#B2E372]">
              💬
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-[#2C2E2A] truncate">{orgNome}</h1>
                <span className="text-[11px] font-mono text-[#63695B] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A8E75]" />
                  <span>WhatsApp Conectado</span>
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

        {/* 2. Grupos de Menu (General, Analytics, Workspace Settings) */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] text-xs">
          
          {/* GRUPO GENERAL */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
                General
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard"
                title="Dashboard Overview"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  pathname === "/dashboard"
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Dashboard</span>}
              </Link>

              <Link
                href="/dashboard/crm"
                title="Leads & CRM Kanban"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/crm")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Leads</span>}
              </Link>

              <Link
                href="/dashboard/settings/campanhas"
                title="Campaigns & UTMs"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/campanhas")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Campaigns</span>}
              </Link>

              <Link
                href="/dashboard/inbox"
                title="Conversations (Inbox)"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                } ${
                  isLinkActive("/dashboard/inbox")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                  {!collapsed && <span>Conversations</span>}
                </div>
                {!collapsed && <span className="w-2 h-2 rounded-full bg-[#C1ED84] border border-[#7A8E75]" />}
              </Link>
            </div>
          </div>

          {/* GRUPO ANALYTICS */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
                Analytics
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard"
                title="Attribution Funnel"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]`}
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Attribution</span>}
              </Link>

              <Link
                href="/dashboard/quiz/editor"
                title="Quiz de Qualificação"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/quiz/editor")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <FileQuestion className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Quiz de Triagem</span>}
              </Link>
            </div>
          </div>

          {/* GRUPO WORKSPACE SETTINGS */}
          <div>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8472]">
                Workspace Settings
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/dashboard/settings/whatsapp"
                title="Conexão WhatsApp (Evolution / Meta)"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/whatsapp")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Phone className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Connections</span>}
              </Link>

              <Link
                href="/dashboard/settings/regras"
                title="Regras de IA & Áudio Humanizado"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/regras")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Auto-replies (IA)</span>}
              </Link>

              <Link
                href="/dashboard/settings/equipe"
                title="Equipe & Vendedores (Round-Robin)"
                className={`flex items-center rounded-xl font-medium transition ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
                } ${
                  isLinkActive("/dashboard/settings/equipe")
                    ? "bg-white text-[#2C2E2A] font-bold shadow-sm border border-[#E0E3DE]"
                    : "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-[#7A8E75]" />
                {!collapsed && <span>Team & Roles</span>}
              </Link>
            </div>
          </div>

        </nav>
      </div>

      {/* 3. Rodapé da Sidebar: Card Promocional Sage + Perfil do Usuário */}
      <div className="p-3 border-t border-[#E0E3DE] space-y-3">
        
        {/* Card Promocional Sage [VISTO NO BEHANCE] */}
        {!collapsed && (
          <div className="p-4 rounded-2xl bg-[#7A8E75] text-white space-y-2 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>🛡️ No Walls, No Limits</span>
            </div>
            <p className="text-[11px] text-[#E7EBE6] leading-tight">
              Upgrade your subscription to unlock unlimited workspaces.
            </p>
            <Link
              href="/dashboard/settings/plano"
              className="w-full py-2 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm mt-1"
            >
              <span>Upgrade</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Perfil & Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E0E3DE]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D0D5CD]">
              {role.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#2C2E2A] block truncate">{role}</span>
                <span className="text-[10px] text-[#7C8472] block truncate">Ativo</span>
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
