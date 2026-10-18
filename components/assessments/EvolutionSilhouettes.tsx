import { AvaliacaoCorporal } from "@/lib/types";
import { ECC_NIVEIS } from "@/lib/constants";
import { formatarDataCurta } from "@/lib/utils";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";

/**
 * Representação ilustrativa Inicial → Evolução → Atual com base no ECC de
 * cada avaliação. É apenas apoio visual e não constitui diagnóstico.
 */
export function EvolutionSilhouettes({
  avaliacoes,
}: {
  avaliacoes: AvaliacaoCorporal[];
}) {
  if (avaliacoes.length === 0) return null;
  const inicial = avaliacoes[0];
  const meio = avaliacoes[Math.floor((avaliacoes.length - 1) / 2)];
  const atual = avaliacoes[avaliacoes.length - 1];
  const etapas = [
    { rotulo: "Inicial", av: inicial },
    { rotulo: "Evolução", av: meio },
    { rotulo: "Atual", av: atual },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {etapas.map(({ rotulo, av }) => {
          const nivel = ECC_NIVEIS.find((n) => n.nivel === av.escoreCorporal);
          return (
            <div
              key={rotulo}
              className="flex flex-col items-center gap-2 rounded-2xl bg-surfaceMuted/70 p-3 text-center sm:p-4"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-muted shadow-soft">
                {rotulo}
              </span>
              <BodySilhouette escore={av.escoreCorporal} tamanho="md" />
              <span className="numeric text-base font-bold text-ink">
                ECC {av.escoreCorporal}
              </span>
              {nivel && <span className="text-xs text-ink-muted">{nivel.label}</span>}
              <span className="text-xs text-ink-faint">{formatarDataCurta(av.data)}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        Ilustração simulada a partir do escore de cada avaliação. É apenas um apoio
        visual: não representa a aparência real do animal nem realiza diagnóstico.
      </p>
    </div>
  );
}
