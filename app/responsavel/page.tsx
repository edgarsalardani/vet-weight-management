"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FlaskConical, FolderOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { Spinner } from "@/components/ui/Spinner";
import { WeightChart } from "@/components/charts/WeightChart";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
import { AssessmentListItem } from "@/components/assessments/AssessmentListItem";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { DocumentListItem } from "@/components/documents/DocumentListItem";
import { NextAppointmentCard } from "@/components/agenda/NextAppointmentCard";
import { ReturnReminderBanner } from "@/components/agenda/ReturnReminderBanner";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { buscarRecomendacaoAtual } from "@/lib/services/recommendationService";
import { buscarProximoCompromisso } from "@/lib/services/appointmentService";
import { listarDocumentosPorAnimal } from "@/lib/services/documentService";
import { buscarParticipacaoPorAnimal } from "@/lib/services/researchService";
import {
  Animal,
  AvaliacaoCorporal,
  Compromisso,
  Documento,
  ProjetoPesquisa,
  Recomendacao,
} from "@/lib/types";
import { PORTE_LABELS, classificarEscore } from "@/lib/constants";
import {
  calcularIdadeTexto,
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

export default function MeuPetPage() {
  const { sessao } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [recomendacaoAtual, setRecomendacaoAtual] = useState<Recomendacao | null>(null);
  const [proximoRetorno, setProximoRetorno] = useState<Compromisso | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [projeto, setProjeto] = useState<ProjetoPesquisa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!sessao?.animalId) return;
    let ativo = true;
    async function carregar() {
      const [a, avals, rec, retorno, docs, participacao] = await Promise.all([
        buscarAnimalPorId(sessao!.animalId!),
        listarAvaliacoesPorAnimal(sessao!.animalId!),
        buscarRecomendacaoAtual(sessao!.animalId!),
        buscarProximoCompromisso(sessao!.animalId!, "retorno_clinico"),
        listarDocumentosPorAnimal(sessao!.animalId!),
        buscarParticipacaoPorAnimal(sessao!.animalId!),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setAvaliacoes(avals);
      setRecomendacaoAtual(rec);
      setProximoRetorno(retorno);
      setDocumentos(docs);
      setProjeto(participacao?.projeto ?? null);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [sessao]);

  if (carregando) return <Spinner label="Carregando seu pet…" />;
  if (!animal) return <p className="text-ink-muted">Nenhum animal vinculado.</p>;

  const atual = avaliacoes[avaliacoes.length - 1] ?? null;
  const inicial = avaliacoes[0] ?? null;
  const meio = avaliacoes[Math.floor((avaliacoes.length - 1) / 2)];
  const temEvolucao = avaliacoes.length >= 2;

  const faixaAtual = atual ? classificarEscore(atual.escoreCorporal) : null;
  const faixaInicial = inicial ? classificarEscore(inicial.escoreCorporal) : null;

  const variacaoPeso =
    temEvolucao && inicial && atual
      ? calcularVariacaoPercentual(inicial.peso, atual.peso)
      : null;
  const deltaPeso = temEvolucao && inicial && atual ? inicial.peso - atual.peso : null;

  const ultimosRelatorios = [...avaliacoes].reverse();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
        <h1 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">
          {animal.nome}
        </h1>
        <p className="text-sm text-ink-muted">
          {animal.raca} · {PORTE_LABELS[animal.porte]} ·{" "}
          {calcularIdadeTexto(animal.dataNascimento)}
        </p>
      </div>

      {proximoRetorno && (
        <>
          <ReturnReminderBanner compromisso={proximoRetorno} nomeAnimal={animal.nome} />
          <div className="mb-4">
            <NextAppointmentCard
              compromisso={proximoRetorno}
              nomeAnimal={animal.nome}
              onAtualizado={setProximoRetorno}
            />
          </div>
        </>
      )}

      {recomendacaoAtual && (
        <div className="mb-4">
          <h2 className="mb-2 text-sm font-medium text-ink">
            Recomendações atuais
          </h2>
          <RecommendationCard recomendacao={recomendacaoAtual} vigente />
        </div>
      )}

      {projeto && (
        <Link
          href="/responsavel/pesquisa"
          className="mb-4 flex items-center gap-3 rounded-card border border-line bg-surface p-3.5 shadow-card transition-colors hover:border-primary/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
            <FlaskConical className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-faint">Projeto de pesquisa</p>
            <p className="truncate text-sm font-medium text-ink">{projeto.nome}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />
        </Link>
      )}

      {!atual ? (
        <p className="text-center text-sm text-ink-muted">
          Ainda não há avaliações registradas para {animal.nome}.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Peso atual" valor={formatarPeso(atual.peso)} />
            <Stat
              label="Escore corporal"
              valor={`${atual.escoreCorporal}/9`}
              variacao={faixaAtual?.label}
              tomVariacao={
                faixaAtual?.categoria === "ideal"
                  ? "positivo"
                  : faixaAtual?.categoria === "high"
                  ? "negativo"
                  : "neutral"
              }
            />
            {atual.massaGorda != null && (
              <Stat label="Massa gorda" valor={`${atual.massaGorda}%`} />
            )}
            {atual.massaMagra != null && (
              <Stat label="Massa magra" valor={`${atual.massaMagra}%`} />
            )}
          </div>

          {temEvolucao && (
            <Card className="mt-4">
              <CardHeader>
                <p className="text-sm font-medium text-ink">
                  Progresso desde o início do acompanhamento
                </p>
              </CardHeader>
              <CardBody className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat
                  label={
                    (deltaPeso ?? 0) >= 0 ? "Peso perdido" : "Peso ganho"
                  }
                  valor={formatarPeso(Math.abs(deltaPeso ?? 0))}
                  variacao={formatarPercentualComSinal(variacaoPeso ?? 0)}
                />
                <Stat
                  label="Escore corporal"
                  valor={`${inicial!.escoreCorporal} → ${atual.escoreCorporal}`}
                />
                <Stat
                  label="Acompanhando desde"
                  valor={formatarDataCurta(inicial!.data)}
                />
              </CardBody>
            </Card>
          )}

          {temEvolucao && (
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <p className="text-sm font-medium text-ink">
                    Peso ao longo do tempo
                  </p>
                </CardHeader>
                <CardBody>
                  <WeightChart avaliacoes={avaliacoes} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <p className="text-sm font-medium text-ink">
                    Escore de condição corporal ao longo do tempo
                  </p>
                </CardHeader>
                <CardBody>
                  <ScoreChart avaliacoes={avaliacoes} />
                </CardBody>
              </Card>

              {(atual.massaGorda != null || atual.massaMagra != null) && (
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
                    Representação visual da evolução
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="mb-4 text-xs text-ink-muted">
                    Ilustração simulada com base no escore de cada avaliação —
                    não representa a aparência real do animal.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[inicial!, meio, atual].map((av, i) => {
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

              <Card>
                <CardHeader>
                  <p className="text-sm font-medium text-ink">
                    Comparação: início × atual
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-3">
                    <ColunaComparacao
                      rotulo="Início"
                      avaliacao={inicial!}
                      tom={TOM_POR_CATEGORIA[faixaInicial!.categoria]}
                    />
                    <ColunaComparacao
                      rotulo="Atual"
                      avaliacao={atual}
                      tom={TOM_POR_CATEGORIA[faixaAtual!.categoria]}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-medium text-ink">
              Últimos relatórios pós-retorno
            </h2>
            <div className="space-y-3">
              {ultimosRelatorios.map((av) => (
                <AssessmentListItem key={av.id} avaliacao={av} />
              ))}
            </div>
          </div>

          {documentos.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-ink">
                <FolderOpen className="h-4 w-4" />
                Documentos disponibilizados
              </h2>
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <DocumentListItem key={doc.id} documento={doc} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ColunaComparacao({
  rotulo,
  avaliacao,
  tom,
}: {
  rotulo: string;
  avaliacao: AvaliacaoCorporal;
  tom: "low" | "ideal" | "high";
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-control border border-line bg-surfaceMuted/60 p-4 text-center">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        {rotulo}
      </span>
      {avaliacao.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avaliacao.fotoUrl}
          alt={`Foto — ${rotulo.toLowerCase()}`}
          className="h-16 w-16 rounded-control border border-line object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-control bg-white text-[11px] text-ink-faint">
          Sem foto
        </div>
      )}
      <p className="numeric text-sm font-medium text-ink">
        {formatarPeso(avaliacao.peso)}
      </p>
      <Badge tom={tom}>ECC {avaliacao.escoreCorporal}</Badge>
      <p className="text-[11px] text-ink-muted">
        {formatarDataCurta(avaliacao.data)}
      </p>
    </div>
  );
}
