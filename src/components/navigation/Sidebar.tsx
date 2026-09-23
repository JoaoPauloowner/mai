"use client";

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
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface SidebarProps {
  segmento: string;
  orgNome: string;
  role: string;
}

export function Sidebar({ segmento, orgNome }: SidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    const active = isLinkActive(path);
    return `flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
      active
        ? "bg-neutral-900 text-white font-medium"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-neutral-200">
        <div className="font-bold text-base text-neutral-900 tracking-tight">MAI</div>
        <div className="text-xs text-neutral-500 truncate">{orgNome || "Workspace"}</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Core */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
            Geral
          </div>
          <Link href="/dashboard" className={navLinkClass("/dashboard")}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Visão Geral</span>
          </Link>
          <Link href="/dashboard/crm" className={navLinkClass("/dashboard/crm")}>
            <Kanban className="w-4 h-4" />
            <span>Pipeline CRM</span>
          </Link>
          <Link href="/dashboard/inbox" className={navLinkClass("/dashboard/inbox")}>
            <MessageSquare className="w-4 h-4" />
            <span>Chat Unificado</span>
          </Link>
          <Link href="/dashboard/campanhas" className={navLinkClass("/dashboard/campanhas")}>
            <Target className="w-4 h-4" />
            <span>Campanhas</span>
          </Link>
          <Link href="/dashboard/importar" className={navLinkClass("/dashboard/importar")}>
            <Upload className="w-4 h-4" />
            <span>Importar Leads</span>
          </Link>
        </div>

        {/* Vertical Auto */}
        {(segmento === "AUTO" || segmento === "GERAL") && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
              Automotivo
            </div>
            <Link href="/dashboard/auto/estoque" className={navLinkClass("/dashboard/auto/estoque")}>
              <Car className="w-4 h-4" />
              <span>Estoque</span>
            </Link>
            <Link href="/dashboard/auto/avaliacao-usados" className={navLinkClass("/dashboard/auto/avaliacao-usados")}>
              <FileCheck2 className="w-4 h-4" />
              <span>Avaliação Usados</span>
            </Link>
            <Link href="/dashboard/auto/test-drives" className={navLinkClass("/dashboard/auto/test-drives")}>
              <CalendarDays className="w-4 h-4" />
              <span>Test-Drives</span>
            </Link>
          </div>
        )}

        {/* Vertical Seguros */}
        {(segmento === "SEGUROS" || segmento === "GERAL") && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
              Seguros
            </div>
            <Link href="/dashboard/seguros/cotacoes" className={navLinkClass("/dashboard/seguros/cotacoes")}>
              <Scale className="w-4 h-4" />
              <span>Cotações</span>
            </Link>
            <Link href="/dashboard/seguros/radar-renovacoes" className={navLinkClass("/dashboard/seguros/radar-renovacoes")}>
              <ShieldCheck className="w-4 h-4" />
              <span>Renovações</span>
            </Link>
            <Link href="/dashboard/seguros/ligacoes-vapi" className={navLinkClass("/dashboard/seguros/ligacoes-vapi")}>
              <PhoneCall className="w-4 h-4" />
              <span>Voz Vapi</span>
            </Link>
          </div>
        )}

        {/* Vertical Contabil */}
        {(segmento === "CONTABIL" || segmento === "GERAL") && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
              Contábil
            </div>
            <Link href="/dashboard/contabil/guias" className={navLinkClass("/dashboard/contabil/guias")}>
              <ReceiptText className="w-4 h-4" />
              <span>Guias Tributárias</span>
            </Link>
            <Link href="/dashboard/contabil/auditoria-xml" className={navLinkClass("/dashboard/contabil/auditoria-xml")}>
              <FileText className="w-4 h-4" />
              <span>Auditoria XML</span>
            </Link>
            <Link href="/dashboard/contabil/helpdesk" className={navLinkClass("/dashboard/contabil/helpdesk")}>
              <LifeBuoy className="w-4 h-4" />
              <span>Helpdesk</span>
            </Link>
          </div>
        )}

        {/* Vertical Clinica */}
        {(segmento === "CLINICA" || segmento === "GERAL") && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
              Clínica
            </div>
            <Link href="/dashboard/clinica/consultas" className={navLinkClass("/dashboard/clinica/consultas")}>
              <Stethoscope className="w-4 h-4" />
              <span>Consultas</span>
            </Link>
            <Link href="/dashboard/clinica/no-show" className={navLinkClass("/dashboard/clinica/no-show")}>
              <ClockAlert className="w-4 h-4" />
              <span>Anti No-Show</span>
            </Link>
          </div>
        )}

        {/* Configurações */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 pb-1">
            Configurações
          </div>
          <Link href="/dashboard/settings/whatsapp" className={navLinkClass("/dashboard/settings/whatsapp")}>
            <Phone className="w-4 h-4" />
            <span>WhatsApp</span>
          </Link>
          <Link href="/dashboard/settings/instagram" className={navLinkClass("/dashboard/settings/instagram")}>
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram</span>
          </Link>
          <Link href="/dashboard/settings/ia-prompts" className={navLinkClass("/dashboard/settings/ia-prompts")}>
            <Settings className="w-4 h-4" />
            <span>Prompts IA</span>
          </Link>
          <Link href="/dashboard/settings/equipe" className={navLinkClass("/dashboard/settings/equipe")}>
            <Users className="w-4 h-4" />
            <span>Equipe</span>
          </Link>
          <Link href="/dashboard/settings/quiz" className={navLinkClass("/dashboard/settings/quiz")}>
            <FileQuestion className="w-4 h-4" />
            <span>Quiz Captação</span>
          </Link>
          <Link href="/dashboard/settings/geral" className={navLinkClass("/dashboard/settings/geral")}>
            <Settings className="w-4 h-4" />
            <span>Geral</span>
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-neutral-200">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
