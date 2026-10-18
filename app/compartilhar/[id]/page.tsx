"use client";

import { useEffect, useState } from "react";
import { PawPrint } from "lucide-react";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Card, CardBody } from "@/components/ui/Card";
import { MetricTile } from "@/components/ui/MetricTile";
import { Spinner } from "@/components/ui/Spinner";
import { WeightChart } from "@/components/charts/WeightChart";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { USUARIO_MOCK } from "@/lib/mock-data";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { classificarEscore } from "@/lib/constants";
import {
  calcularVariacaoPercentual,
  formatarDataCurta,
  formatarPercentualComSinal,
  formatarPeso,
} from "@/lib/utils";

export default function CompartilharPage({
  params,
}: {
  params: { id: string };
}) {
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

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner />
      </div>
    );
  }

  if (!animal || avaliacoes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-center">
        <p className="text-base text-ink-muted">
          Nenhuma avaliação disponível para exibir no momento.
        </p>
      </div>
    );
  }

  const inicial = avaliacoes[0];
  const atual = avaliacoes[avaliacoes.length - 1];
  const temEvolucao = avaliacoes.length >= 2;
  const variacaoPeso = calcularVariacaoPercentual(inicial.peso, atual.peso);
  const faixaAtual = classificarEscore(atual.escoreCorporal);

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-bg to-bg pb-16">
      <div className="mx-auto max-w-md animate-fade-in px-4 pt-10">
        <div className="flex flex-col items-center text-center">
          <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">{animal.nome}</h1>
          <p className="mt-1 text-base text-ink-muted">
            Acompanhamento de condição corporal
          </p>
        </div>

        <Card className="mt-6">
          <CardBody className="text-center">
            <p className="text-sm text-ink-muted">
              {temEvolucao
                ? "Situação desde o início do acompanhamento"
                : "Situação na última avaliação"}
            </p>
            <p className="mt-2 text-xl font-bold text-ink">{faixaAtual.label}</p>
            <p className="mt-2 text-sm text-ink-muted">
              Avaliado em {formatarDataCurta(atual.data)} por {USUARIO_MOCK.nome}
            </p>
          </CardBody>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricTile label="Peso atual" valor={formatarPeso(atual.peso)} />
          <MetricTile
            label={temEvolucao ? "Variação de peso" : "Peso inicial"}
            valor={
              temEvolucao
                ? formatarPercentualComSinal(variacaoPeso)
                : formatarPeso(inicial.peso)
            }
          />
        </div>

        {temEvolucao && (
          <Card className="mt-4">
            <CardBody>
              <h2 className="mb-3 text-base font-bold text-ink">Peso ao longo do tempo</h2>
              <WeightChart avaliacoes={avaliacoes} />
            </CardBody>
          </Card>
        )}

        <div className="mt-10 flex flex-col items-center gap-1 text-center text-sm text-ink-muted">
          <span className="flex items-center gap-2 font-semibold text-ink">
            <PawPrint className="h-4 w-4 text-primary" />
            VetCheck
          </span>
          <span>
            {USUARIO_MOCK.nome}
            {USUARIO_MOCK.crmv ? ` · ${USUARIO_MOCK.crmv}` : ""}
          </span>
        </div>
      </div>
    </main>
  );
}
