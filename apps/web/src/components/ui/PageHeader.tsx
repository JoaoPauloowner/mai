import React from "react";
import { twMerge } from "tailwind-merge";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-200 mb-6",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
