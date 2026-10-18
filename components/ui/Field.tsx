"use client";

import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** Envolve um controle de formulário com label, texto de apoio e erro. */
export function FieldWrapper({
  label,
  htmlFor,
  erro,
  ajuda,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  erro?: string;
  ajuda?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-status-high"> *</span>}
      </label>
      {children}
      {ajuda && !erro && (
        <p className="text-xs text-ink-muted">{ajuda}</p>
      )}
      {erro && <p className="text-xs text-status-high">{erro}</p>}
    </div>
  );
}

const controlBase =
  "h-11 w-full rounded-control border bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  erro?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, erro, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        controlBase,
        erro
          ? "border-status-high focus:ring-status-high/30"
          : "border-line focus:border-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  erro?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, erro, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        controlBase,
        "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%235B6B67%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z%22 clip-rule=%22evenodd%22/></svg>')] bg-no-repeat bg-[right_0.875rem_center] pr-9",
        erro
          ? "border-status-high focus:ring-status-high/30"
          : "border-line focus:border-primary",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  erro?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, erro, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-control border bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
        erro
          ? "border-status-high focus:ring-status-high/30"
          : "border-line focus:border-primary",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
