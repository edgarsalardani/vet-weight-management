import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Badge } from "@/components/ui/Badge";
import { PORTE_LABELS } from "@/lib/constants";
import { classificarEscore } from "@/lib/constants";
import { formatarPeso } from "@/lib/utils";

const TOM_POR_CATEGORIA = {
  low: "low",
  ideal: "ideal",
  high: "high",
} as const;

export function AnimalCard({
  animal,
  ultimaAvaliacao,
}: {
  animal: Animal;
  ultimaAvaliacao?: AvaliacaoCorporal | null;
}) {
  const faixa = ultimaAvaliacao
    ? classificarEscore(ultimaAvaliacao.escoreCorporal)
    : null;

  return (
    <Link
      href={`/animais/${animal.id}`}
      className="flex items-center gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:border-primary/40 sm:p-4"
    >
      <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-ink">{animal.nome}</p>
          {faixa && (
            <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]} className="shrink-0">
              ECC {ultimaAvaliacao!.escoreCorporal}
            </Badge>
          )}
        </div>
        <p className="truncate text-sm text-ink-muted">
          {animal.raca} · {PORTE_LABELS[animal.porte]}
        </p>
        <p className="truncate text-xs text-ink-faint">
          Responsável: {animal.responsavelNome}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {ultimaAvaliacao && (
          <span className="numeric text-sm font-medium text-ink">
            {formatarPeso(ultimaAvaliacao.peso)}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-ink-faint" />
      </div>
    </Link>
  );
}
