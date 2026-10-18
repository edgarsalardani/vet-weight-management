"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stat } from "@/components/ui/Stat";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeightChart } from "@/components/charts/WeightChart";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { EvolutionSilhouettes } from "@/components/assessments/EvolutionSilhouettes";
import { ChartCard } from "@/components/charts/ChartCard";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import {
  calcularVariacaoPercentual,
  formatarDataCurta,
  formatarPercentualComSinal,
  formatarPeso,
} from "@/lib/utils";
import { classificarEscore } from "@/lib/constants";
import { TrendingUp, ChevronRight } from "lucide-react";

function distanciaDoIdeal(escore: number): number {
  if (escore < 4) return 4 - escore;
  if (escore > 5) return escore - 5;
  return 0;
}

export default function EvolucaoPage({ params }: { params: { id: string } }) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, avals] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarAvaliacoesPorAnimal(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setAvaliacoes(avals);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando evolução…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length < 2) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          titulo="Evolução"
          subtitulo={animal.nome}
          voltarPara={`/animais/${animal.id}`}
        />
        <EmptyState
          icon={TrendingUp}
          titulo="Histórico insuficiente"
          descricao="São necessárias ao menos duas avaliações para exibir a evolução do paciente."
        />
      </div>
    );
  }

  const inicial = avaliacoes[0];
  const atual = avaliacoes[avaliacoes.length - 1];
  
  const variacaoPeso = calcularVariacaoPercentual(inicial.peso, atual.peso);
  const deltaPeso = inicial.peso - atual.peso; // positivo = perdeu peso
  const rotuloDeltaPeso = deltaPeso >= 0 ? "Peso perdido" : "Peso ganho";

  const distInicial = distanciaDoIdeal(inicial.escoreCorporal);
  const distAtual = distanciaDoIdeal(atual.escoreCorporal);
  let tomEscore: "positivo" | "negativo" | "neutral" = "neutral";
  let textoEscore = "Estável";
  if (distAtual < distInicial) {
    tomEscore = "positivo";
    textoEscore = "Aproximando-se do ideal";
  } else if (distAtual > distInicial) {
    tomEscore = "negativo";
    textoEscore = "Afastando-se do ideal";
  }

  const faixaAtual = classificarEscore(atual.escoreCorporal);

  const temMassaGorda = inicial.massaGorda != null && atual.massaGorda != null;
  const temMassaMagra = inicial.massaMagra != null && atual.massaMagra != null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titulo="Evolução"
        subtitulo={`${animal.nome} · ${formatarDataCurta(inicial.data)} a ${formatarDataCurta(
          atual.data
        )}`}
        voltarPara={`/animais/${animal.id}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Stat label="Peso inicial" valor={formatarPeso(inicial.peso)} />
        <Stat label="Peso atual" valor={formatarPeso(atual.peso)} />
        <Stat
          label={rotuloDeltaPeso}
          valor={formatarPeso(Math.abs(deltaPeso))}
          variacao={formatarPercentualComSinal(variacaoPeso)}
        />
        <Stat
          label="Escore corporal"
          valor={`${inicial.escoreCorporal} → ${atual.escoreCorporal}`}
          variacao={textoEscore}
          tomVariacao={tomEscore}
        />
        {temMassaGorda && (
          <Stat label="Massa gorda" valor={`${inicial.massaGorda}% → ${atual.massaGorda}%`} />
        )}
        {temMassaMagra && (
          <Stat label="Massa magra" valor={`${inicial.massaMagra}% → ${atual.massaMagra}%`} />
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-2">
        <ChartCard titulo="Peso ao longo do tempo" className="lg:col-span-2">
          <WeightChart avaliacoes={avaliacoes} />
        </ChartCard>

        <ChartCard
          titulo="Escore de condição corporal"
          descricao={`Situação atual: ${faixaAtual.label}`}
        >
          <ScoreChart avaliacoes={avaliacoes} />
        </ChartCard>

        {(temMassaGorda || temMassaMagra) && (
          <ChartCard titulo="Composição corporal">
            <CompositionChart avaliacoes={avaliacoes} />
          </ChartCard>
        )}

        <ChartCard
          titulo="Representação visual da evolução"
          className="lg:col-span-2"
        >
          <EvolutionSilhouettes avaliacoes={avaliacoes} />
        </ChartCard>
      </div>

      <Link
        href={`/animais/${animal.id}/comparacao`}
        className="group mt-6 flex items-center justify-between gap-3 rounded-card border border-line/70 bg-surface p-5 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <span className="text-base font-semibold text-primary">
          Ver comparação completa (inicial, anterior e atual)
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
