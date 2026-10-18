import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/utils";

export function NavCard({
  href,
  icon,
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
        "group flex h-full items-center gap-4 rounded-card border border-line/70 bg-surface p-4 shadow-card transition duration-150 ease-out sm:p-5",
        desabilitado
          ? "opacity-70"
          : "hover:-translate-y-0.5 hover:shadow-elevated active:translate-y-0 active:scale-[0.99]",
        className
      )}
    >
      <IconTile
        icon={icon}
        className={desabilitado ? "bg-surfaceMuted text-ink-faint" : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-ink">{titulo}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{descricao}</p>
      </div>
      {!desabilitado && (
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5" />
      )}
    </div>
  );

  if (desabilitado) return <div aria-disabled="true">{conteudo}</div>;

  return (
    <Link href={href} className="block rounded-card">
      {conteudo}
    </Link>
  );
}
