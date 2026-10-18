import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  acao,
}: {
  icon: LucideIcon;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-line/70 bg-surface px-6 py-14 text-center shadow-soft">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-bold text-ink">{titulo}</p>
        {descricao && (
          <p className="mx-auto max-w-sm text-base text-ink-muted">{descricao}</p>
        )}
      </div>
      {acao}
    </div>
  );
}
