import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2 py-0.5 rounded border border-neutral-300 text-[11px] font-mono uppercase bg-neutral-100 text-neutral-800",
          className
        )
      )}
    >
      {status}
    </span>
  );
}
