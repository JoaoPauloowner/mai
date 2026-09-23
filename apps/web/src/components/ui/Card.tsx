import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "bordered";
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(clsx("bg-white border border-neutral-200 rounded p-4 text-neutral-900", className))}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("pb-3 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge("text-sm font-semibold text-neutral-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge("text-xs text-neutral-500", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("pt-2", className)} {...props}>
      {children}
    </div>
  );
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  badge?: string;
}

export function MetricCard({ label, value, subtext, trend, icon, badge }: MetricCardProps) {
  return (
    <div className="p-4 bg-white border border-neutral-200 rounded space-y-2">
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{label}</span>
        {icon}
      </div>

      <div className="text-2xl font-bold text-neutral-900">{value}</div>

      {(subtext || trend || badge) && (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {trend && (
            <span className={trend.positive ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
              {trend.value}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
          {badge && <span className="border border-neutral-200 px-1 rounded text-[10px]">{badge}</span>}
        </div>
      )}
    </div>
  );
}
