import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={twMerge(
              "w-full rounded border border-neutral-300 bg-white py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none disabled:opacity-50",
              icon ? "pl-9 pr-3" : "px-3",
              error ? "border-red-500" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
