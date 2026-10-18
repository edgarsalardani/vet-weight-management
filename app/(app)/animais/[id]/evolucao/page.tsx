"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeightChart } from "@/components/charts/WeightChart";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
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

  if (carregando) return <Spinner label="Carregando evolução…" />;
  if (!animal) return <p className="text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length < 2) {
    return (
      <div className="mx-auto max-w-2xl">
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
  const meio = avaliacoes[Math.floor((avaliacoes.length - 1) / 2)];

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
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Evolução"
        subtitulo={`${animal.nome} · ${formatarDataCurta(inicial.data)} — ${formatarDataCurta(
          atual.data
        )}`}
        voltarPara={`/animais/${animal.id}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <Stat
            label="Massa gorda"
            valor={`${inicial.massaGorda}% → ${atual.massaGorda}%`}
          />
        )}
        {temMassaMagra && (
          <Stat
            label="Massa magra"
            valor={`${inicial.massaMagra}% → ${atual.massaMagra}%`}
          />
        )}
      </div>

      <div className="mt-5 space-y-4">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-ink">Peso ao longo do tempo</p>
          </CardHeader>
          <CardBody>
            <WeightChart avaliacoes={avaliacoes} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-ink">
              Escore de Condição Corporal ao longo do tempo
            </p>
          </CardHeader>
          <CardBody>
            <ScoreChart avaliacoes={avaliacoes} />
            <p className="mt-2 text-xs text-ink-muted">
              Situação atual:{" "}
              <span className="font-medium text-ink">{faixaAtual.label}</span>
            </p>
          </CardBody>
        </Card>

        {(temMassaGorda || temMassaMagra) && (
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-ink">
                Composição corporal ao longo do tempo
              </p>
            </CardHeader>
            <CardBody>
              <CompositionChart avaliacoes={avaliacoes} />
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-ink">
              Representação visual da evolução corporal
            </p>
          </CardHeader>
          <CardBody>
            <p className="mb-4 text-xs text-ink-muted">
              Ilustração simulada com base no escore de cada avaliação — não
              representa a aparência real do animal.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[inicial, meio, atual].map((av, i) => {
                const rotulo = ["Inicial", "Evolução", "Atual"][i];
                return (
                  <div
                    key={av.id}
                    className="flex flex-col items-center gap-1.5 rounded-control border border-line bg-surfaceMuted/60 p-3 text-center"
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                      {rotulo}
                    </span>
                    <BodySilhouette escore={av.escoreCorporal} tamanho="md" />
                    <span className="numeric text-sm font-medium text-ink">
                      ECC {av.escoreCorporal}
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      {formatarDataCurta(av.data)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Link
          href={`/animais/${animal.id}/comparacao`}
          className="flex items-center justify-center gap-1.5 rounded-card border border-line bg-surface py-3 text-sm font-medium text-primary shadow-card hover:border-primary/40"
        >
          Ver comparação completa (inicial × atual)
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
