import type { ReactNode } from "react";

export function DataTable({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-xl border border-[#E7E7E4] bg-white ${className}`}>{children}</div>;
}

export function DataTableHeader({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 border-b border-[#F0F0ED] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">{children}</div>;
}

export function DataTableScroll({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
