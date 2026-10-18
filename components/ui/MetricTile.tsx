import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Indicador clínico em destaque (sempre visível): rótulo, valor grande e detalhe opcional. */
export function MetricTile({
  label,
  valor,
  detalhe,
  className,
}: {
  label: string;
  valor: ReactNode;
  detalhe?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line/60 bg-white/90 p-4 shadow-soft",
        className
      )}
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="numeric mt-1 text-xl font-bold leading-tight text-ink sm:text-2xl">
        {valor}
      </p>
      {detalhe && <div className="mt-1.5 text-sm text-ink-muted">{detalhe}</div>}
    </div>
  );
}
