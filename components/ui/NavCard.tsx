import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavCard({
  href,
  icon: Icon,
  titulo,
  descricao,
  desabilitado = false,
  className,
}: {
  href: string;
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  desabilitado?: boolean;
  className?: string;
}) {
  const conteudo = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card transition-colors",
        desabilitado ? "opacity-50" : "hover:border-primary/40",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{titulo}</p>
        <p className="truncate text-xs text-ink-muted">{descricao}</p>
      </div>
      {!desabilitado && <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />}
    </div>
  );

  if (desabilitado) return conteudo;

  return <Link href={href}>{conteudo}</Link>;
}
