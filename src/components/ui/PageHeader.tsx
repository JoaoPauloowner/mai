import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#E7E7E4] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A9A94]">{eyebrow}</div> : null}
        <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[#171717]">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-xs leading-5 text-[#7A7A74]">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
