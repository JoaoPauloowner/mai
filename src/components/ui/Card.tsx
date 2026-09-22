import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "sage" | "highlight";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const variantStyles = {
    default: "bg-white border border-[#E0E3DE] shadow-xs text-[#2C2E2A]",
    subtle: "bg-[#FBFBFB] border border-[#E0E3DE] text-[#2C2E2A]",
    sage: "bg-[#7A8E75] border border-[#63695B] text-white",
    highlight: "bg-white border-2 border-[#C1ED84] shadow-sm text-[#2C2E2A]",
  };

  return (
    <div
      className={twMerge(clsx("rounded-2xl p-6 transition-all", variantStyles[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  context?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaType = "positive",
  context,
  icon,
  className,
}: MetricCardProps) {
  const deltaBadgeClass =
    deltaType === "positive"
      ? "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"
      : deltaType === "negative"
      ? "bg-[#E9BEC4] text-[#9B2226] border-red-200"
      : "bg-[#E7EBE6] text-[#63695B] border-[#D0D5CD]";

  return (
    <Card className={twMerge("space-y-3 relative overflow-hidden", className)}>
      <div className="flex items-center justify-between text-xs text-[#63695B] font-medium">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-[#E7EBE6] text-[#7A8E75] flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="font-semibold text-xs text-[#2C2E2A]">{label}</span>
        </div>
        {delta && (
          <span className={clsx("px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border", deltaBadgeClass)}>
            {delta}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="text-3xl font-extrabold font-mono text-[#2C2E2A] tracking-tight">{value}</div>
          {context && <span className="text-[11px] text-[#7C8472]">{context}</span>}
        </div>
      </div>
    </Card>
  );
}
