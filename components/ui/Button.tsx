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
    "bg-primary text-white shadow-soft hover:bg-primary-dark hover:shadow-card active:bg-primary-dark disabled:bg-primary-100 disabled:text-ink-faint disabled:shadow-none",
  secondary:
    "border border-line bg-white text-ink shadow-soft hover:border-primary/40 hover:bg-primary-50 disabled:bg-surfaceMuted disabled:text-ink-faint disabled:shadow-none",
  ghost:
    "bg-transparent text-primary hover:bg-primary-50 disabled:text-ink-faint",
  danger:
    "border border-danger/30 bg-white text-danger hover:bg-danger-bg disabled:text-ink-faint",
};

// Alturas de 44 px (sm) e 48 px (md): alvo de toque confortável no celular.
const sizeClasses: Record<Size, string> = {
  md: "h-12 px-6 text-base",
  sm: "h-11 px-4 text-sm",
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
        aria-busy={carregando || undefined}
        className={cn(
          "inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold transition duration-150 ease-out",
          "active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
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
