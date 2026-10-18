"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, dataRelativaAHoje, gerarGradeMensal, nomeDoMes } from "@/lib/utils";

const DIAS_SEMANA_ABREV = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MonthCalendar({
  ano,
  mes,
  diasComEventos,
  selecionado,
  onSelecionar,
  onMudarMes,
}: {
  ano: number;
  mes: number; // 1-12
  diasComEventos: Record<string, number>;
  selecionado: string | null;
  onSelecionar: (dataISO: string) => void;
  onMudarMes: (ano: number, mes: number) => void;
}) {
  const celulas = gerarGradeMensal(ano, mes);
  const hoje = dataRelativaAHoje(0);

  function irParaMesAnterior() {
    if (mes === 1) onMudarMes(ano - 1, 12);
    else onMudarMes(ano, mes - 1);
  }

  function irParaProximoMes() {
    if (mes === 12) onMudarMes(ano + 1, 1);
    else onMudarMes(ano, mes + 1);
  }

  return (
    <div className="rounded-card border border-line bg-surface p-3 shadow-card sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">
          {nomeDoMes(mes)} <span className="text-ink-muted">{ano}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={irParaMesAnterior}
            aria-label="Mês anterior"
            className="flex h-8 w-8 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surfaceMuted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={irParaProximoMes}
            aria-label="Próximo mês"
            className="flex h-8 w-8 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surfaceMuted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink-faint">
        {DIAS_SEMANA_ABREV.map((d, i) => (
          <span key={i} className="py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celulas.map((celula) => {
          const numeroDia = Number(celula.dataISO.slice(8, 10));
          const ehHoje = celula.dataISO === hoje;
          const ehSelecionado = celula.dataISO === selecionado;
          const qtdEventos = diasComEventos[celula.dataISO] ?? 0;

          return (
            <button
              key={celula.dataISO}
              type="button"
              onClick={() => onSelecionar(celula.dataISO)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-control text-sm transition-colors",
                !celula.noMesAtual && "text-ink-faint/50",
                celula.noMesAtual && !ehSelecionado && "text-ink hover:bg-surfaceMuted",
                ehSelecionado && "bg-primary text-white",
                ehHoje && !ehSelecionado && "ring-1 ring-inset ring-primary/50"
              )}
            >
              {numeroDia}
              {qtdEventos > 0 && (
                <span
                  className={cn(
                    "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                    ehSelecionado ? "bg-white" : "bg-primary"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
