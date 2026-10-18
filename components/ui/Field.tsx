"use client";

import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Envolve um controle de formulário com rótulo, texto de apoio e mensagem de erro. */
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
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {ajuda && !erro && <p className="text-sm text-ink-muted">{ajuda}</p>}
      {erro && (
        <p
          id={`${htmlFor}-erro`}
          className="flex animate-fade-in items-start gap-1.5 text-sm font-medium text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {erro}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-control border bg-white text-base text-ink placeholder:text-ink-faint transition duration-150 focus:outline-none focus:ring-4";

const estadoNormal =
  "border-line hover:border-primary/40 focus:border-primary focus:ring-primary/15";
const estadoErro =
  "border-danger bg-danger-bg/40 focus:border-danger focus:ring-danger/15";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  erro?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, erro, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={erro || undefined}
      aria-describedby={erro && props.id ? `${props.id}-erro` : undefined}
      className={cn(
        controlBase,
        "h-12 px-4",
        erro ? estadoErro : estadoNormal,
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
      aria-invalid={erro || undefined}
      aria-describedby={erro && props.id ? `${props.id}-erro` : undefined}
      className={cn(
        controlBase,
        "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%234F675E%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z%22 clip-rule=%22evenodd%22/></svg>')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pl-4 pr-11",
        erro ? estadoErro : estadoNormal,
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
      aria-invalid={erro || undefined}
      aria-describedby={erro && props.id ? `${props.id}-erro` : undefined}
      className={cn(
        controlBase,
        "min-h-[96px] px-4 py-3",
        erro ? estadoErro : estadoNormal,
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
