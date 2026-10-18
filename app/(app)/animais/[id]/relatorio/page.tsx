"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { Spinner } from "@/components/ui/Spinner";
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

  if (carregando) return <Spinner label="Carregando relatório…" />;
  if (!animal) return <p className="text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
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
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Relatório pós-retorno"
        subtitulo={formatarDataCurta(atual.data)}
        voltarPara={`/animais/${animal.id}`}
      />

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <p className="font-medium text-ink">{animal.nome}</p>
            <p className="text-xs text-ink-muted">
              {animal.raca} · {PORTE_LABELS[animal.porte]} · Responsável:{" "}
              {animal.responsavelNome}
            </p>
          </div>
          <Badge tom={TOM_POR_CATEGORIA[faixaAtual.categoria]}>
            ECC {atual.escoreCorporal} · {faixaAtual.label}
          </Badge>
        </CardHeader>
        <CardBody className="flex items-center gap-4">
          {atual.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={atual.fotoUrl}
              alt={`Foto do retorno de ${formatarDataCurta(atual.data)}`}
              className="h-20 w-20 rounded-control border border-line object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-control bg-surfaceMuted text-xs text-ink-faint">
              Sem foto
            </div>
          )}
          <p className="text-sm text-ink-muted">
            Retorno registrado em{" "}
            <span className="font-medium text-ink">
              {formatarDataCurta(atual.data)}
            </span>
            {anterior && (
              <>
                {" "}
                · retorno anterior em{" "}
                <span className="font-medium text-ink">
                  {formatarDataCurta(anterior.data)}
                </span>
              </>
            )}
          </p>
        </CardBody>
      </Card>

      {anterior ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <p className="mt-4 text-sm text-ink-muted">
          Este é o primeiro registro do paciente — ainda não há um retorno
          anterior para comparação.
        </p>
      )}

      {temComparacaoInicial && (
        <div className="mt-4">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Desde o início do acompanhamento ({formatarDataCurta(inicial.data)})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        </div>
      )}

      {anterior && (
        <Card className="mt-4">
          <CardHeader>
            <p className="text-sm font-medium text-ink">Comparação visual</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1.5 rounded-control border border-line bg-surfaceMuted/60 p-3 text-center">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Retorno anterior
                </span>
                <BodySilhouette escore={anterior.escoreCorporal} tamanho="md" />
                <span className="numeric text-sm font-medium text-ink">
                  ECC {anterior.escoreCorporal}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {formatarDataCurta(anterior.data)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-control border border-line bg-surfaceMuted/60 p-3 text-center">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Retorno atual
                </span>
                <BodySilhouette escore={atual.escoreCorporal} tamanho="md" />
                <span className="numeric text-sm font-medium text-ink">
                  ECC {atual.escoreCorporal}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {formatarDataCurta(atual.data)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {avaliacoes.length >= 2 && (
        <Card className="mt-4">
          <CardHeader>
            <p className="text-sm font-medium text-ink">
              Gráfico resumido da evolução
            </p>
          </CardHeader>
          <CardBody>
            <WeightChart avaliacoes={avaliacoes} />
          </CardBody>
        </Card>
      )}

      {recomendacaoAtual && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-medium text-ink">
            Recomendações / plano de manejo vigente
          </h2>
          <RecommendationCard recomendacao={recomendacaoAtual} vigente />
        </div>
      )}

      <Card className="mt-4">
        <CardHeader>
          <p className="text-sm font-medium text-ink">Observações da veterinária</p>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-ink">
            {atual.observacoes || "Sem observações registradas para este retorno."}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
