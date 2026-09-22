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

  let style = "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"; // default active/verified
  let label = status;

  if (["ACTIVE", "VERIFIED", "GANHO", "CONNECTED"].includes(normalized)) {
    style = "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]";
    label = normalized === "GANHO" ? "Venda Concluída" : normalized === "CONNECTED" ? "Conectado" : "Verificado";
  } else if (["DISABLED", "REJECTED", "DUPLICATE", "PERDIDO", "DISCONNECTED"].includes(normalized)) {
    style = "bg-[#E9BEC4] text-[#9B2226] border-red-200";
    label = normalized === "PERDIDO" ? "Desqualificado" : normalized === "DISCONNECTED" ? "Desconectado" : "Inativo";
  } else if (["PAUSED", "PAUSE", "PHONE_UNVERIFIED", "NOVO", "QUALIFICADO", "AGENDADO", "CONNECTING"].includes(normalized)) {
    style = "bg-[#E1D6AF] text-[#8F5D18] border-[#D0C496]";
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
