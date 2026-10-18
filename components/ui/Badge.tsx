import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tom = "low" | "ideal" | "high" | "neutral";

const tomClasses: Record<Tom, string> = {
  low: "bg-status-lowBg text-status-low",
  ideal: "bg-status-idealBg text-status-ideal",
  high: "bg-status-highBg text-status-high",
  neutral: "bg-surfaceMuted text-ink-muted",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: Tom;
  /** Ponto colorido antes do texto (por padrão aparece nos tons de status). */
  dot?: boolean;
}

export function Badge({
  tom = "neutral",
  dot,
  className,
  children,
  ...props
}: BadgeProps) {
  const mostrarPonto = dot ?? tom !== "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        tomClasses[tom],
        className
      )}
      {...props}
    >
      {mostrarPonto && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
