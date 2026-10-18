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
  const [dia, mes, ano] = formatarDataCurta(avaliacao.data).split(" ");

  return (
    <article className="flex items-start gap-4 rounded-card border border-line/70 bg-surface p-4 shadow-card sm:p-5">
      {avaliacao.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avaliacao.fotoUrl}
          alt={`Foto da avaliação de ${formatarDataCurta(avaliacao.data)}`}
          className="h-16 w-16 shrink-0 rounded-2xl border border-line object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary-50 text-primary"
        >
          <span className="numeric text-2xl font-bold leading-none">{dia}</span>
          <span className="mt-1 text-xs font-bold uppercase">{mes}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-bold text-ink">
            {dia} {mes} {ano}
          </p>
          <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]}>
            ECC {avaliacao.escoreCorporal} · {faixa.label}
          </Badge>
        </div>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <div>
            <dt className="inline">Peso: </dt>
            <dd className="numeric inline text-base font-bold text-ink">
              {formatarPeso(avaliacao.peso)}
            </dd>
          </div>
          {avaliacao.massaGorda != null && (
            <div>
              <dt className="inline">Massa gorda: </dt>
              <dd className="numeric inline text-base font-bold text-ink">
                {avaliacao.massaGorda}%
              </dd>
            </div>
          )}
          {avaliacao.massaMagra != null && (
            <div>
              <dt className="inline">Massa magra: </dt>
              <dd className="numeric inline text-base font-bold text-ink">
                {avaliacao.massaMagra}%
              </dd>
            </div>
          )}
        </dl>

        {avaliacao.observacoes && (
          <p className="mt-3 text-base text-ink-muted">{avaliacao.observacoes}</p>
        )}
      </div>
    </article>
  );
}
