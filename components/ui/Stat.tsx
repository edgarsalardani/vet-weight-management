import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stat({
  label,
  valor,
  variacao,
  tomVariacao = "neutral",
}: {
  label: string;
  valor: ReactNode;
  variacao?: string;
  tomVariacao?: "positivo" | "negativo" | "neutral";
}) {
  return (
    <div className="rounded-card border border-line/70 bg-surface p-4 shadow-soft sm:p-5">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="numeric mt-1.5 break-words text-lg font-bold leading-snug text-ink sm:text-xl">
        {valor}
      </p>
      {variacao && (
        <span
          className={cn(
            "numeric mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            tomVariacao === "positivo" && "bg-status-idealBg text-status-ideal",
            tomVariacao === "negativo" && "bg-status-highBg text-status-high",
            tomVariacao === "neutral" && "bg-surfaceMuted text-ink-muted"
          )}
        >
          {variacao}
        </span>
      )}
    </div>
  );
}
