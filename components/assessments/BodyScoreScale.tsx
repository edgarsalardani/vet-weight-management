"use client";

import { classificarEscore } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CORES_FAIXA: Record<string, string> = {
  low: "bg-status-low",
  ideal: "bg-status-ideal",
  high: "bg-status-high",
};

/**
 * Escala de 1 a 9. Quando `onChange` é informado, funciona como seletor
 * (usado no formulário de avaliação); caso contrário, é somente leitura.
 */
export function BodyScoreScale({
  value,
  onChange,
  tamanho = "md",
}: {
  value: number;
  onChange?: (valor: number) => void;
  tamanho?: "sm" | "md";
}) {
  const faixa = classificarEscore(value);
  const interativo = Boolean(onChange);

  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-9 gap-1.5",
          tamanho === "sm" ? "gap-1" : "gap-1.5"
        )}
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
              aria-pressed={ativo}
              aria-label={`Escore ${n}`}
              className={cn(
                "flex items-center justify-center rounded-control border font-mono text-sm font-medium transition-all numeric",
                tamanho === "sm" ? "h-8" : "h-11",
                ativo
                  ? cn(
                      CORES_FAIXA[faixaDoNumero.categoria],
                      "border-transparent text-white shadow-sm"
                    )
                  : "border-line bg-white text-ink-muted",
                interativo && !ativo && "hover:border-primary/50 cursor-pointer",
                !interativo && "cursor-default"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
        <span>1 · Muito magro</span>
        <span
          className={cn(
            "font-medium",
            faixa.categoria === "low" && "text-status-low",
            faixa.categoria === "ideal" && "text-status-ideal",
            faixa.categoria === "high" && "text-status-high"
          )}
        >
          {faixa.label}
        </span>
        <span>9 · Obeso</span>
      </div>
    </div>
  );
}
