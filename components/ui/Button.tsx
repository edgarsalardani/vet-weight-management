"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  carregando?: boolean;
  full?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-ink-faint",
  secondary:
    "bg-white text-ink border border-line hover:bg-surfaceMuted disabled:text-ink-faint",
  ghost: "bg-transparent text-ink hover:bg-surfaceMuted disabled:text-ink-faint",
  danger:
    "bg-transparent text-status-high border border-status-high/40 hover:bg-status-highBg disabled:text-ink-faint",
};

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  sm: "h-9 px-3.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      carregando = false,
      full = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || carregando}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          full && "w-full",
          className
        )}
        {...props}
      >
        {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
