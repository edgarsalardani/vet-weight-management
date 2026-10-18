import Link from "next/link";
import { FlaskConical, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/IconTile";
import { ProjetoPesquisa } from "@/lib/types";
import { STATUS_PROJETO_LABELS } from "@/lib/constants";
import { formatarDataCurta } from "@/lib/utils";

const TOM_STATUS = {
  planejado: "low",
  em_andamento: "ideal",
  concluido: "neutral",
} as const;

export function ResearchProjectCard({
  projeto,
  quantidadeParticipantes,
}: {
  projeto: ProjetoPesquisa;
  quantidadeParticipantes: number;
}) {
  return (
    <Link href={`/pesquisa/${projeto.id}`} className="group block rounded-card">
      <div className="flex items-start gap-4 rounded-card border border-line/70 bg-surface p-5 shadow-card transition duration-150 ease-out group-hover:-translate-y-0.5 group-hover:shadow-elevated group-active:scale-[0.99]">
        <IconTile icon={FlaskConical} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-bold text-ink">{projeto.nome}</p>
            <Badge tom={TOM_STATUS[projeto.status]}>
              {STATUS_PROJETO_LABELS[projeto.status]}
            </Badge>
          </div>
          <p className="mt-1.5 line-clamp-2 text-base text-ink-muted">{projeto.descricao}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
            <span>
              {formatarDataCurta(projeto.periodoInicio)}
              {projeto.periodoFim ? ` a ${formatarDataCurta(projeto.periodoFim)}` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Users className="h-4 w-4 text-primary" />
              {quantidadeParticipantes}{" "}
              {quantidadeParticipantes === 1 ? "participante" : "participantes"}
            </span>
          </div>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
