import Link from "next/link";
import { FlaskConical, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
    <Link
      href={`/pesquisa/${projeto.id}`}
      className="flex items-start gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:border-primary/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
        <FlaskConical className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-ink">{projeto.nome}</p>
          <Badge tom={TOM_STATUS[projeto.status]}>
            {STATUS_PROJETO_LABELS[projeto.status]}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
          {projeto.descricao}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
          <span>
            {formatarDataCurta(projeto.periodoInicio)}
            {projeto.periodoFim ? ` – ${formatarDataCurta(projeto.periodoFim)}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {quantidadeParticipantes}{" "}
            {quantidadeParticipantes === 1 ? "participante" : "participantes"}
          </span>
        </div>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-faint" />
    </Link>
  );
}
