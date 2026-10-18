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
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-ink">{titulo}</p>
        {descricao && (
          <p className="max-w-xs text-sm text-ink-muted">{descricao}</p>
        )}
      </div>
      {acao}
    </div>
  );
}
