import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "sage";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all select-none rounded-xl disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary: "bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] shadow-sm focus:ring-[#C1ED84]",
      secondary: "bg-white hover:bg-[#F7F7F6] text-[#2C2E2A] border border-[#E0E3DE] shadow-sm focus:ring-[#7A8E75]",
      outline: "border border-[#E0E3DE] text-[#2C2E2A] hover:bg-[#E7EBE6] focus:ring-[#7A8E75]",
      ghost: "text-[#63695B] hover:text-[#2C2E2A] hover:bg-[#E7EBE6] focus:ring-[#7A8E75]",
      danger: "bg-[#E9BEC4] text-[#9B2226] hover:bg-red-200 border border-red-200 focus:ring-red-500",
      sage: "bg-[#7A8E75] hover:bg-[#63695B] text-white shadow-sm focus:ring-[#7A8E75]",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-xs gap-2",
      lg: "px-6 py-3 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
        {...props}
      >
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
