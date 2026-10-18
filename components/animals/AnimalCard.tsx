import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Badge } from "@/components/ui/Badge";
import { PORTE_LABELS, classificarEscore } from "@/lib/constants";
import { calcularIdadeTexto, formatarPeso } from "@/lib/utils";

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
    <Link href={`/animais/${animal.id}`} className="group block rounded-card">
      <div className="flex h-full flex-col gap-4 rounded-card border border-line/70 bg-surface p-5 shadow-card transition duration-150 ease-out group-hover:-translate-y-0.5 group-hover:shadow-elevated group-active:scale-[0.99]">
        <div className="flex items-center gap-4">
          <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold tracking-tight text-ink">{animal.nome}</p>
            <p className="truncate text-base text-ink-muted">
              {animal.raca} · {PORTE_LABELS[animal.porte]}
            </p>
            <p className="truncate text-sm text-ink-muted">
              {calcularIdadeTexto(animal.dataNascimento)}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5" />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-4">
          {ultimaAvaliacao && faixa ? (
            <>
              <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]}>
                ECC {ultimaAvaliacao.escoreCorporal} · {faixa.label}
              </Badge>
              <span className="numeric text-base font-bold text-ink">
                {formatarPeso(ultimaAvaliacao.peso)}
              </span>
            </>
          ) : (
            <span className="text-sm text-ink-muted">Sem avaliações ainda</span>
          )}
        </div>
      </div>
    </Link>
  );
}
