import { AvaliacaoCorporal } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { classificarEscore } from "@/lib/constants";
import { formatarDataCurta, formatarPeso } from "@/lib/utils";

const TOM_POR_CATEGORIA = {
  low: "low",
  ideal: "ideal",
  high: "high",
} as const;

export function AssessmentListItem({
  avaliacao,
}: {
  avaliacao: AvaliacaoCorporal;
}) {
  const faixa = classificarEscore(avaliacao.escoreCorporal);

  return (
    <div className="flex items-start gap-4 rounded-card border border-line bg-surface p-4 shadow-card">
      {avaliacao.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avaliacao.fotoUrl}
          alt={`Foto da avaliação de ${formatarDataCurta(avaliacao.data)}`}
          className="h-14 w-14 shrink-0 rounded-control border border-line object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-control bg-surfaceMuted text-center">
          <span className="numeric text-xs font-semibold text-ink">
            {formatarDataCurta(avaliacao.data).split(" ")[0]}
          </span>
          <span className="text-[10px] uppercase text-ink-muted">
            {formatarDataCurta(avaliacao.data).split(" ")[1]}
          </span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink">
            {formatarDataCurta(avaliacao.data)}
          </p>
          <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]}>
            ECC {avaliacao.escoreCorporal} · {faixa.label}
          </Badge>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
          <span>
            Peso:{" "}
            <span className="numeric font-medium text-ink">
              {formatarPeso(avaliacao.peso)}
            </span>
          </span>
          {avaliacao.massaGorda != null && (
            <span>
              Massa gorda:{" "}
              <span className="numeric font-medium text-ink">
                {avaliacao.massaGorda}%
              </span>
            </span>
          )}
          {avaliacao.massaMagra != null && (
            <span>
              Massa magra:{" "}
              <span className="numeric font-medium text-ink">
                {avaliacao.massaMagra}%
              </span>
            </span>
          )}
        </div>

        {avaliacao.observacoes && (
          <p className="mt-2 text-sm text-ink-muted">{avaliacao.observacoes}</p>
        )}
      </div>
    </div>
  );
}
