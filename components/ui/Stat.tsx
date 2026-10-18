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
    <div className="rounded-card border border-line bg-surface p-4 shadow-card">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="numeric mt-1 text-xl font-semibold text-ink">{valor}</p>
      {variacao && (
        <p
          className={cn(
            "numeric mt-0.5 text-xs font-medium",
            tomVariacao === "positivo" && "text-status-ideal",
            tomVariacao === "negativo" && "text-status-high",
            tomVariacao === "neutral" && "text-ink-muted"
          )}
        >
          {variacao}
        </p>
      )}
    </div>
  );
}
