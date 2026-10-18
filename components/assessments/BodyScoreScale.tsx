"use client";

import { ECC_NIVEIS, classificarEscore } from "@/lib/constants";
import { cn } from "@/lib/utils";

const COR_ATIVA: Record<string, string> = {
  low: "bg-status-low",
  ideal: "bg-status-ideal",
  high: "bg-status-high",
};

const COR_TEXTO: Record<string, string> = {
  low: "text-status-low",
  ideal: "text-status-ideal",
  high: "text-status-high",
};

const LEGENDA = [
  { categoria: "low", label: "1–3 abaixo do ideal" },
  { categoria: "ideal", label: "4–5 ideal" },
  { categoria: "high", label: "6–9 acima do ideal" },
];

/**
 * Escala de 1 a 9. Quando `onChange` é informado, funciona como seletor
 * (formulário de avaliação); caso contrário, é somente leitura.
 * No celular os botões ficam em duas linhas para manter um bom alvo de toque.
 */
export function BodyScoreScale({
  value,
  onChange,
}: {
  value: number;
  onChange?: (valor: number) => void;
  tamanho?: "sm" | "md";
}) {
  const faixa = classificarEscore(value);
  const nivel = ECC_NIVEIS.find((n) => n.nivel === value);
  const interativo = Boolean(onChange);

  return (
    <div>
      <div
        role={interativo ? "radiogroup" : undefined}
        aria-label="Escore de condição corporal de 1 a 9"
        className="grid grid-cols-5 gap-2 sm:grid-cols-9"
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const ativo = n === value;
          const faixaDoNumero = classificarEscore(n);
          return (
            <button
              key={n}
              type="button"
              disabled={!interativo}
              onClick={() => onChange?.(n)}
              role={interativo ? "radio" : undefined}
              aria-checked={interativo ? ativo : undefined}
              aria-label={`Escore ${n}`}
              className={cn(
                "numeric flex h-12 items-center justify-center rounded-control border text-lg font-bold transition duration-150",
                ativo
                  ? cn(COR_ATIVA[faixaDoNumero.categoria], "scale-105 border-transparent text-white shadow-card")
                  : "border-line bg-white text-ink-muted",
                interativo && !ativo && "hover:border-primary/40 hover:bg-primary-50 active:scale-95",
                !interativo && "cursor-default"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-base text-ink-muted" aria-live="polite">
        Selecionado:{" "}
        <span className={cn("font-bold", COR_TEXTO[faixa.categoria])}>
          ECC {value}
          {nivel ? ` · ${nivel.label}` : ""}
        </span>
      </p>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
        {LEGENDA.map((l) => (
          <li key={l.categoria} className="flex items-center gap-1.5">
            <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full", COR_ATIVA[l.categoria])} />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
