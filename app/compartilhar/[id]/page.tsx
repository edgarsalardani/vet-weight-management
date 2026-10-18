"use client";

import { useEffect, useState } from "react";
import { PawPrint } from "lucide-react";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Card, CardBody } from "@/components/ui/Card";
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
        <p className="text-ink-muted">
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
    <div className="min-h-screen bg-bg pb-16">
      <div className="mx-auto max-w-md px-4 pt-10">
        <div className="flex flex-col items-center text-center">
          <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
          <h1 className="mt-3 text-2xl font-semibold text-ink">{animal.nome}</h1>
          <p className="text-sm text-ink-muted">
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
            <p className="mt-2 text-lg font-medium text-ink">
              {faixaAtual.label}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Avaliado em {formatarDataCurta(atual.data)} pela {USUARIO_MOCK.nome}
            </p>
          </CardBody>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs text-ink-muted">Peso atual</p>
              <p className="numeric mt-1 text-xl font-semibold text-ink">
                {formatarPeso(atual.peso)}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs text-ink-muted">
                {temEvolucao ? "Variação de peso" : "Peso inicial"}
              </p>
              <p className="numeric mt-1 text-xl font-semibold text-ink">
                {temEvolucao
                  ? formatarPercentualComSinal(variacaoPeso)
                  : formatarPeso(inicial.peso)}
              </p>
            </CardBody>
          </Card>
        </div>

        {temEvolucao && (
          <Card className="mt-4">
            <CardBody>
              <p className="mb-2 text-sm font-medium text-ink">
                Peso ao longo do tempo
              </p>
              <WeightChart avaliacoes={avaliacoes} />
            </CardBody>
          </Card>
        )}

        <div className="mt-8 flex flex-col items-center gap-1 text-center text-xs text-ink-faint">
          <span className="flex items-center gap-1.5 font-medium text-ink-muted">
            <PawPrint className="h-3.5 w-3.5" />
            VetCheck
          </span>
          <span>
            {USUARIO_MOCK.nome}
            {USUARIO_MOCK.crmv ? ` · ${USUARIO_MOCK.crmv}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
