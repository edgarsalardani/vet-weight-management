import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TAMANHOS = {
  sm: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
  md: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
};

/** Ícone dentro de uma caixa arredondada suave — padrão visual único para listas e cards. */
export function IconTile({
  icon: Icon,
  tamanho = "md",
  className,
}: {
  icon: LucideIcon;
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary",
        TAMANHOS[tamanho],
        className
      )}
    >
      <Icon />
    </span>
  );
}
