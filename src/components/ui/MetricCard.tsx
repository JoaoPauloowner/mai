import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  helper?: string;
  accent?: "orange" | "green" | "neutral";
};

export function MetricCard({ label, value, delta, icon, helper, accent = "orange" }: MetricCardProps) {
  const iconClass = accent === "green" ? "bg-[#EAF7EF] text-[#247A4A]" : accent === "orange" ? "bg-[#FFF1E9] text-[#FF6A2A]" : "bg-[#F4F4F2] text-[#6F6F6F]";
  const deltaClass = delta?.startsWith("-") ? "bg-[#FDE8E8] text-[#B42318]" : "bg-[#EAF7EF] text-[#247A4A]";
  return (
    <article className="rounded-xl border border-[#E7E7E4] bg-white p-5 shadow-[0_2px_8px_rgba(23,23,23,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#6F6F6F]">{label}</span>
        {icon ? <span className={`grid h-8 w-8 place-items-center rounded-lg ${iconClass}`}>{icon}</span> : null}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="truncate text-[26px] font-semibold tracking-[-0.04em] text-[#171717]">{value}</strong>
        {delta ? <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${deltaClass}`}>{delta}</span> : null}
      </div>
      {helper ? <p className="mt-2 text-[10px] text-[#9A9A94]">{helper}</p> : null}
    </article>
  );
}
