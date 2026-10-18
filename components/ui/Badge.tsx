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
}

export function Badge({ tom = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tomClasses[tom],
        className
      )}
      {...props}
    />
  );
}
