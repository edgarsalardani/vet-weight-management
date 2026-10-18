import { Check } from "lucide-react";
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
  const concluida = atividade.status === "concluido";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          aria-hidden
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
            concluida
              ? "border-status-ideal bg-status-ideal text-white"
              : "border-line bg-white"
          }`}
        >
          {concluida && <Check className="h-4 w-4" />}
        </span>
        {!ultimo && <span className="mt-1 w-0.5 flex-1 rounded-full bg-line" />}
      </div>
      <div className="min-w-0 flex-1 pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-bold text-ink">{atividade.titulo}</p>
          <Badge tom={STATUS_ATIVIDADE_TOM[atividade.status]}>
            {STATUS_ATIVIDADE_LABELS[atividade.status]}
          </Badge>
        </div>
        <p className="numeric text-sm text-ink-muted">{formatarDataCurta(atividade.data)}</p>
        {atividade.instrucao && (
          <p className="mt-1.5 text-base text-ink-muted">{atividade.instrucao}</p>
        )}
      </div>
    </div>
  );
}
