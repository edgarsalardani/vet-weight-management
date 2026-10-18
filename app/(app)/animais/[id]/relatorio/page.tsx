"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ChartCard } from "@/components/charts/ChartCard";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeightChart } from "@/components/charts/WeightChart";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { buscarRecomendacaoAtual } from "@/lib/services/recommendationService";
import { Animal, AvaliacaoCorporal, Recomendacao } from "@/lib/types";
import { PORTE_LABELS, classificarEscore } from "@/lib/constants";
import {
  calcularVariacaoPercentual,
  formatarDataCurta,
  formatarPercentualComSinal,
  formatarPeso,
} from "@/lib/utils";

const TOM_POR_CATEGORIA = {
  low: "low",
  ideal: "ideal",
  high: "high",
} as const;

export default function RelatorioPage({
  params,
}: {
  params: { id: string };
}) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [recomendacaoAtual, setRecomendacaoAtual] = useState<Recomendacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, avals, rec] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarAvaliacoesPorAnimal(params.id),
        buscarRecomendacaoAtual(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setAvaliacoes(avals);
      setRecomendacaoAtual(rec);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando relatório…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          titulo="Relatório pós-retorno"
          subtitulo={animal.nome}
          voltarPara={`/animais/${animal.id}`}
        />
        <EmptyState
          icon={FileText}
          titulo="Nenhum retorno registrado"
          descricao="Registre uma avaliação para gerar o relatório do retorno."
        />
      </div>
    );
  }

  const atual = avaliacoes[avaliacoes.length - 1];
  const anterior =
    avaliacoes.length >= 2 ? avaliacoes[avaliacoes.length - 2] : null;
  const inicial = avaliacoes[0];
  const temComparacaoInicial = inicial.id !== atual.id;

  const faixaAtual = classificarEscore(atual.escoreCorporal);

  const variacaoPeso = anterior
    ? calcularVariacaoPercentual(anterior.peso, atual.peso)
    : null;
  const variacaoPesoDesdeInicio = temComparacaoInicial
    ? calcularVariacaoPercentual(inicial.peso, atual.peso)
    : null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titulo="Relatório pós-retorno"
        subtitulo={formatarDataCurta(atual.data)}
        voltarPara={`/animais/${animal.id}`}
      />

      <div className="space-y-8">
        {/* Identificação do paciente e do retorno */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary-50 via-white to-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold tracking-tight text-ink">{animal.nome}</p>
                <p className="mt-1 text-base text-ink-muted">
                  {animal.raca} · {PORTE_LABELS[animal.porte]}
                </p>
                <p className="text-base text-ink-muted">
                  Responsável: <span className="font-semibold text-ink">{animal.responsavelNome}</span>
                </p>
              </div>
              <Badge tom={TOM_POR_CATEGORIA[faixaAtual.categoria]}>
                ECC {atual.escoreCorporal} · {faixaAtual.label}
              </Badge>
            </div>
            <div className="mt-5 flex items-center gap-4">
              {atual.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={atual.fotoUrl}
                  alt={`Foto do retorno de ${formatarDataCurta(atual.data)}`}
                  className="h-24 w-24 rounded-2xl border border-line object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-sm text-ink-faint shadow-soft">
                  Sem foto
                </div>
              )}
              <p className="text-base text-ink-muted">
                Retorno registrado em{" "}
                <span className="font-semibold text-ink">{formatarDataCurta(atual.data)}</span>
                {anterior && (
                  <>
                    {" "}
                    · retorno anterior em{" "}
                    <span className="font-semibold text-ink">{formatarDataCurta(anterior.data)}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Comparação com o retorno anterior */}
        <section>
          <SectionTitle>Em relação ao retorno anterior</SectionTitle>
          {anterior ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <Stat
                label="Peso anterior → atual"
                valor={`${formatarPeso(anterior.peso)} → ${formatarPeso(atual.peso)}`}
              />
              <Stat
                label="Variação de peso"
                valor={formatarPercentualComSinal(variacaoPeso ?? 0)}
              />
              <Stat
                label="Escore corporal"
                valor={`${anterior.escoreCorporal} → ${atual.escoreCorporal}`}
              />
              {(anterior.massaGorda != null || atual.massaGorda != null) && (
                <Stat
                  label="Massa gorda"
                  valor={`${anterior.massaGorda ?? "—"}% → ${atual.massaGorda ?? "—"}%`}
                />
              )}
              {(anterior.massaMagra != null || atual.massaMagra != null) && (
                <Stat
                  label="Massa magra"
                  valor={`${anterior.massaMagra ?? "—"}% → ${atual.massaMagra ?? "—"}%`}
                />
              )}
            </div>
          ) : (
            <p className="rounded-card bg-surface p-5 text-base text-ink-muted shadow-soft">
              Este é o primeiro registro do paciente — ainda não há um retorno
              anterior para comparação.
            </p>
          )}
        </section>

        {/* Comparação com a avaliação inicial */}
        {temComparacaoInicial && (
          <section>
            <SectionTitle>
              Desde o início do acompanhamento
              <span className="ml-2 text-base font-medium text-ink-muted">
                ({formatarDataCurta(inicial.data)})
              </span>
            </SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <Stat
                label="Peso inicial → atual"
                valor={`${formatarPeso(inicial.peso)} → ${formatarPeso(atual.peso)}`}
                variacao={formatarPercentualComSinal(variacaoPesoDesdeInicio ?? 0)}
              />
              <Stat
                label="Escore corporal"
                valor={`${inicial.escoreCorporal} → ${atual.escoreCorporal}`}
              />
              {(inicial.massaGorda != null || atual.massaGorda != null) && (
                <Stat
                  label="Massa gorda"
                  valor={`${inicial.massaGorda ?? "—"}% → ${atual.massaGorda ?? "—"}%`}
                />
              )}
              {(inicial.massaMagra != null || atual.massaMagra != null) && (
                <Stat
                  label="Massa magra"
                  valor={`${inicial.massaMagra ?? "—"}% → ${atual.massaMagra ?? "—"}%`}
                />
              )}
            </div>
          </section>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {anterior && (
            <ChartCard titulo="Comparação visual" descricao="Ilustração simulada, apenas apoio visual">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { rotulo: "Retorno anterior", av: anterior },
                  { rotulo: "Retorno atual", av: atual },
                ].map(({ rotulo, av }) => (
                  <div
                    key={rotulo}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-surfaceMuted/70 p-4 text-center"
                  >
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-muted shadow-soft">
                      {rotulo}
                    </span>
                    <BodySilhouette escore={av.escoreCorporal} tamanho="md" />
                    <span className="numeric text-base font-bold text-ink">
                      ECC {av.escoreCorporal}
                    </span>
                    <span className="text-xs text-ink-muted">{formatarDataCurta(av.data)}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {avaliacoes.length >= 2 && (
            <ChartCard titulo="Gráfico resumido da evolução">
              <WeightChart avaliacoes={avaliacoes} />
            </ChartCard>
          )}
        </div>

        {recomendacaoAtual && (
          <section>
            <SectionTitle>Recomendações e plano de manejo vigente</SectionTitle>
            <RecommendationCard recomendacao={recomendacaoAtual} vigente />
          </section>
        )}

        <section>
          <SectionTitle>Observações da veterinária</SectionTitle>
          <Card>
            <CardBody>
              <p className="text-base text-ink">
                {atual.observacoes || "Sem observações registradas para este retorno."}
              </p>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
