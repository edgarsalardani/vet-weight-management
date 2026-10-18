import { Badge } from "@/components/ui/Badge";
import { AtividadePesquisa } from "@/lib/types";
import { STATUS_ATIVIDADE_LABELS, STATUS_ATIVIDADE_TOM } from "@/lib/constants";
import { formatarDataCurta } from "@/lib/utils";

export function ActivityTimelineItem({
  atividade,
  ultimo = false,
}: {
  atividade: AtividadePesquisa;
  ultimo?: boolean;
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            atividade.status === "concluido" ? "bg-status-ideal" : "bg-line"
          }`}
        />
        {!ultimo && <span className="mt-1 w-px flex-1 bg-line" />}
      </div>
      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink">{atividade.titulo}</p>
          <Badge tom={STATUS_ATIVIDADE_TOM[atividade.status]}>
            {STATUS_ATIVIDADE_LABELS[atividade.status]}
          </Badge>
        </div>
        <p className="numeric text-xs text-ink-muted">
          {formatarDataCurta(atividade.data)}
        </p>
        {atividade.instrucao && (
          <p className="mt-1 text-sm text-ink-muted">{atividade.instrucao}</p>
        )}
      </div>
    </div>
  );
}
