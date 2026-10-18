import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Indicador de carregamento para telas inteiras (redirecionamentos e verificação de sessão). */
export function Spinner({
  className,
  label = "Carregando…",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-ink-muted",
        className
      )}
      role="status"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
