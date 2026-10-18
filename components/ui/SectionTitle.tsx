import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Título de seção padronizado (hierarquia única em todas as telas). */
export function SectionTitle({
  children,
  acao,
  id,
  className,
}: {
  children: ReactNode;
  acao?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 id={id} className="text-lg font-bold tracking-tight text-ink">
        {children}
      </h2>
      {acao}
    </div>
  );
}
