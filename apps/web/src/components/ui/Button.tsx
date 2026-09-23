import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium select-none rounded border disabled:opacity-50 disabled:pointer-events-none focus:outline-none cursor-pointer";

    const variantStyles = {
      primary: "bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800",
      secondary: "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50",
      outline: "bg-transparent border-neutral-300 text-neutral-800 hover:bg-neutral-50",
      ghost: "bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      danger: "bg-red-600 border-red-600 text-white hover:bg-red-700",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1 text-xs gap-1.5",
      md: "px-3.5 py-1.5 text-xs gap-2",
      lg: "px-4 py-2 text-sm gap-2",
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
