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
      primary: "bg-[#FF6A2A] hover:bg-[#EB5417] text-[#171717] shadow-sm focus:ring-[#FF6A2A]",
      secondary: "bg-white hover:bg-[#F7F7F6] text-[#171717] border border-[#E7E7E4] shadow-sm focus:ring-[#FF6A2A]",
      outline: "border border-[#E7E7E4] text-[#171717] hover:bg-[#F4F4F2] focus:ring-[#FF6A2A]",
      ghost: "text-[#6F6F6F] hover:text-[#171717] hover:bg-[#F4F4F2] focus:ring-[#FF6A2A]",
      danger: "bg-[#FDE8E8] text-[#B42318] hover:bg-red-200 border border-red-200 focus:ring-red-500",
      sage: "bg-[#FF6A2A] hover:bg-[#6F6F6F] text-white shadow-sm focus:ring-[#FF6A2A]",
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
