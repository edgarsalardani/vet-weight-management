"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, dataRelativaAHoje, gerarGradeMensal, nomeDoMes } from "@/lib/utils";

const DIAS_SEMANA_ABREV = ["D", "S", "T", "Q", "Q", "S", "S"];
const DIAS_SEMANA_NOME = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

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
  const mesAtualDoCalendario = hoje.slice(0, 7) === `${ano}-${String(mes).padStart(2, "0")}`;

  function irParaMesAnterior() {
    if (mes === 1) onMudarMes(ano - 1, 12);
    else onMudarMes(ano, mes - 1);
  }

  function irParaProximoMes() {
    if (mes === 12) onMudarMes(ano + 1, 1);
    else onMudarMes(ano, mes + 1);
  }

  function irParaHoje() {
    onMudarMes(Number(hoje.slice(0, 4)), Number(hoje.slice(5, 7)));
    onSelecionar(hoje);
  }

  const botaoNav =
    "flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition duration-150 hover:bg-primary-50 hover:text-primary active:scale-95";

  return (
    <div className="rounded-card border border-line/70 bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-ink">
          {nomeDoMes(mes)} <span className="font-medium text-ink-muted">{ano}</span>
        </h2>
        <div className="flex items-center gap-1">
          {!(mesAtualDoCalendario && selecionado === hoje) && (
            <button
              type="button"
              onClick={irParaHoje}
              className="mr-1 h-11 rounded-full px-4 text-sm font-semibold text-primary transition duration-150 hover:bg-primary-50 active:scale-95"
            >
              Hoje
            </button>
          )}
          <button type="button" onClick={irParaMesAnterior} aria-label="Mês anterior" className={botaoNav}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={irParaProximoMes} aria-label="Próximo mês" className={botaoNav}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-ink-faint">
        {DIAS_SEMANA_ABREV.map((d, i) => (
          <span key={i} className="py-1.5" aria-hidden>
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
          const diaSemana = DIAS_SEMANA_NOME[new Date(celula.dataISO + "T00:00:00").getDay()];

          return (
            <button
              key={celula.dataISO}
              type="button"
              onClick={() => onSelecionar(celula.dataISO)}
              aria-pressed={ehSelecionado}
              aria-label={`${numeroDia} de ${nomeDoMes(Number(celula.dataISO.slice(5, 7)))}, ${diaSemana}${
                qtdEventos > 0
                  ? `, ${qtdEventos} ${qtdEventos === 1 ? "compromisso" : "compromissos"}`
                  : ""
              }`}
              className={cn(
                "relative flex aspect-square min-h-[44px] flex-col items-center justify-center rounded-2xl text-base font-medium transition duration-150 active:scale-95",
                !celula.noMesAtual && !ehSelecionado && "text-ink-faint/60",
                celula.noMesAtual && !ehSelecionado && "text-ink hover:bg-primary-50",
                ehSelecionado && "bg-primary font-bold text-white shadow-soft",
                ehHoje && !ehSelecionado && "bg-primary-50 font-bold text-primary"
              )}
            >
              {numeroDia}
              {qtdEventos > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                    ehSelecionado ? "bg-white" : "bg-primary-500"
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
