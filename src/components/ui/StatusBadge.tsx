import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  let style = "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]"; // default active/verified
  let label = status;

  if (["ACTIVE", "VERIFIED", "GANHO", "CONNECTED"].includes(normalized)) {
    style = "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]";
    label = normalized === "GANHO" ? "Venda Concluída" : normalized === "CONNECTED" ? "Conectado" : "Verificado";
  } else if (["DISABLED", "REJECTED", "DUPLICATE", "PERDIDO", "DISCONNECTED"].includes(normalized)) {
    style = "bg-[#FDE8E8] text-[#B42318] border-red-200";
    label = normalized === "PERDIDO" ? "Desqualificado" : normalized === "DISCONNECTED" ? "Desconectado" : "Inativo";
  } else if (["PAUSED", "PAUSE", "PHONE_UNVERIFIED", "NOVO", "QUALIFICADO", "AGENDADO", "CONNECTING"].includes(normalized)) {
    style = "bg-[#FFF3D6] text-[#A15C00] border-[#E8D5A8]";
    label =
      normalized === "NOVO"
        ? "Novo Lead"
        : normalized === "QUALIFICADO"
        ? "Qualificado (SQL)"
        : normalized === "AGENDADO"
        ? "Visita / Reunião"
        : normalized === "CONNECTING"
        ? "Conectando..."
        : "Pausado";
  }

  const sizeClass = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 font-bold font-mono rounded-full border shadow-xs transition-colors",
          sizeClass,
          style,
          className
        )
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
}
