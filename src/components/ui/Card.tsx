import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "sage" | "highlight";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const variantStyles = {
    default: "bg-white border border-[#E7E7E4] shadow-xs text-[#171717]",
    subtle: "bg-[#FAFAFA] border border-[#E7E7E4] text-[#171717]",
    sage: "bg-[#FF6A2A] border border-[#6F6F6F] text-white",
    highlight: "bg-white border-2 border-[#FF6A2A] shadow-sm text-[#171717]",
  };

  return (
    <div
      className={twMerge(clsx("rounded-2xl transition-all overflow-hidden", variantStyles[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("px-6 pt-5 pb-3 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={twMerge("font-serif text-base font-bold text-[#171717] leading-snug", className)} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge("text-xs text-[#6F6F6F] leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("px-6 pb-5", className)} {...props}>
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
      ? "bg-[#EAF7EF] text-[#247A4A] border-[#C8E5D1]"
      : deltaType === "negative"
      ? "bg-[#FDE8E8] text-[#B42318] border-red-200"
      : "bg-[#F4F4F2] text-[#6F6F6F] border-[#D9D9D5]";

  return (
    <Card className={twMerge("space-y-3 relative overflow-hidden", className)}>
      <div className="flex items-center justify-between text-xs text-[#6F6F6F] font-medium">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-[#F4F4F2] text-[#FF6A2A] flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="font-semibold text-xs text-[#171717]">{label}</span>
        </div>
        {delta && (
          <span className={clsx("px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border", deltaBadgeClass)}>
            {delta}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="text-3xl font-extrabold font-mono text-[#171717] tracking-tight">{value}</div>
          {context && <span className="text-[11px] text-[#8A8A84]">{context}</span>}
        </div>
      </div>
    </Card>
  );
}
