"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FlaskConical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { MetricTile } from "@/components/ui/MetricTile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IconTile } from "@/components/ui/IconTile";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { WeightChart } from "@/components/charts/WeightChart";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
import { EvolutionSilhouettes } from "@/components/assessments/EvolutionSilhouettes";
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

const RELATORIOS_VISIVEIS = 3;

export default function MeuPetPage() {
  const { sessao } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [recomendacaoAtual, setRecomendacaoAtual] = useState<Recomendacao | null>(null);
  const [proximoRetorno, setProximoRetorno] = useState<Compromisso | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [projeto, setProjeto] = useState<ProjetoPesquisa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [verTodosRelatorios, setVerTodosRelatorios] = useState(false);

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

  if (carregando) return <PageSkeleton label="Carregando seu animal…" />;
  if (!animal) {
    return <p className="text-base text-ink-muted">Nenhum animal vinculado.</p>;
  }

  const atual = avaliacoes[avaliacoes.length - 1] ?? null;
  const inicial = avaliacoes[0] ?? null;
  const temEvolucao = avaliacoes.length >= 2;

  const faixaAtual = atual ? classificarEscore(atual.escoreCorporal) : null;
  const faixaInicial = inicial ? classificarEscore(inicial.escoreCorporal) : null;

  const variacaoPeso =
    temEvolucao && inicial && atual
      ? calcularVariacaoPercentual(inicial.peso, atual.peso)
      : null;
  const deltaPeso = temEvolucao && inicial && atual ? inicial.peso - atual.peso : null;

  const ultimosRelatorios = [...avaliacoes].reverse();
  const relatoriosExibidos = verTodosRelatorios
    ? ultimosRelatorios
    : ultimosRelatorios.slice(0, RELATORIOS_VISIVEIS);

  const primeiroNome = sessao?.nome.split(" ")[0];

  // Atalhos de navegação dentro da página (somente seções que existem)
  const atalhos = [
    proximoRetorno && { id: "retorno", label: "Retorno" },
    recomendacaoAtual && { id: "recomendacoes", label: "Recomendações" },
    temEvolucao && { id: "evolucao", label: "Evolução" },
    atual && { id: "relatorios", label: "Relatórios" },
    documentos.length > 0 && { id: "documentos", label: "Documentos" },
    projeto && { id: "pesquisa", label: "Pesquisa" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Cartão principal: situação atual sempre visível */}
      <section className="overflow-hidden rounded-card border border-line/70 bg-gradient-to-br from-primary-50 via-white to-white p-5 shadow-card sm:p-8">
        <p className="text-sm font-semibold text-primary">
          {primeiroNome ? `Olá, ${primeiroNome}` : "Olá"}
        </p>
        <div className="mt-3 flex items-center gap-4 sm:gap-5">
          <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{animal.nome}</h1>
            <p className="mt-1 text-base text-ink-muted">
              {animal.raca} · {PORTE_LABELS[animal.porte]}
            </p>
            <p className="text-base text-ink-muted">
              {calcularIdadeTexto(animal.dataNascimento)}
            </p>
          </div>
        </div>

        {atual ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <MetricTile label="Peso atual" valor={formatarPeso(atual.peso)} />
              <MetricTile
                label="Escore corporal"
                valor={`${atual.escoreCorporal} / 9`}
                detalhe={
                  faixaAtual && (
                    <Badge tom={TOM_POR_CATEGORIA[faixaAtual.categoria]}>
                      {faixaAtual.label}
                    </Badge>
                  )
                }
              />
              {atual.massaGorda != null && (
                <MetricTile label="Massa gorda" valor={`${atual.massaGorda}%`} />
              )}
              {atual.massaMagra != null && (
                <MetricTile label="Massa magra" valor={`${atual.massaMagra}%`} />
              )}
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              Última avaliação em{" "}
              <span className="font-semibold text-ink">{formatarDataCurta(atual.data)}</span>
            </p>
          </>
        ) : (
          <p className="mt-6 text-base text-ink-muted">
            Ainda não há avaliações registradas para {animal.nome}.
          </p>
        )}
      </section>

      {/* Atalhos entre as seções da página */}
      {atalhos.length > 1 && (
        <nav
          aria-label="Seções da página"
          className="no-scrollbar sticky top-16 z-20 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-bg/90 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:px-0"
        >
          {atalhos.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="inline-flex h-11 shrink-0 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink-muted shadow-soft transition duration-150 hover:border-primary/40 hover:bg-primary-50 hover:text-primary active:scale-95"
            >
              {a.label}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-6 space-y-10">
        {proximoRetorno && (
          <section id="retorno" className="scroll-mt-36 space-y-4">
            <ReturnReminderBanner compromisso={proximoRetorno} nomeAnimal={animal.nome} />
            <NextAppointmentCard
              compromisso={proximoRetorno}
              nomeAnimal={animal.nome}
              onAtualizado={setProximoRetorno}
            />
          </section>
        )}

        {recomendacaoAtual && (
          <section id="recomendacoes" className="scroll-mt-36">
            <SectionTitle>Recomendações atuais</SectionTitle>
            <RecommendationCard recomendacao={recomendacaoAtual} vigente />
          </section>
        )}

        {atual && temEvolucao && inicial && (
          <section id="evolucao" className="scroll-mt-36 space-y-4">
            <SectionTitle>Progresso desde o início</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              <Stat
                label={(deltaPeso ?? 0) >= 0 ? "Peso perdido" : "Peso ganho"}
                valor={formatarPeso(Math.abs(deltaPeso ?? 0))}
                variacao={formatarPercentualComSinal(variacaoPeso ?? 0)}
              />
              <Stat
                label="Escore corporal"
                valor={`${inicial.escoreCorporal} → ${atual.escoreCorporal}`}
              />
              <Stat label="Acompanhando desde" valor={formatarDataCurta(inicial.data)} />
            </div>

            <ChartCard titulo="Peso ao longo do tempo">
              <WeightChart avaliacoes={avaliacoes} />
            </ChartCard>

            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard titulo="Escore de condição corporal">
                <ScoreChart avaliacoes={avaliacoes} />
              </ChartCard>
              {(atual.massaGorda != null || atual.massaMagra != null) && (
                <ChartCard titulo="Composição corporal">
                  <CompositionChart avaliacoes={avaliacoes} />
                </ChartCard>
              )}
            </div>

            <ChartCard titulo="Representação visual da evolução">
              <EvolutionSilhouettes avaliacoes={avaliacoes} />
            </ChartCard>

            <ChartCard titulo="Comparação: início × atual">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <ColunaComparacao
                  rotulo="Início"
                  avaliacao={inicial}
                  tom={TOM_POR_CATEGORIA[faixaInicial!.categoria]}
                />
                <ColunaComparacao
                  rotulo="Atual"
                  avaliacao={atual}
                  tom={TOM_POR_CATEGORIA[faixaAtual!.categoria]}
                />
              </div>
            </ChartCard>
          </section>
        )}

        {atual && (
          <section id="relatorios" className="scroll-mt-36">
            <SectionTitle>Relatórios pós-retorno</SectionTitle>
            <div className="space-y-4">
              {relatoriosExibidos.map((av) => (
                <AssessmentListItem key={av.id} avaliacao={av} />
              ))}
            </div>
            {ultimosRelatorios.length > RELATORIOS_VISIVEIS && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setVerTodosRelatorios((v) => !v)}
                >
                  {verTodosRelatorios
                    ? "Mostrar menos"
                    : `Ver todos os ${ultimosRelatorios.length} relatórios`}
                </Button>
              </div>
            )}
          </section>
        )}

        {documentos.length > 0 && (
          <section id="documentos" className="scroll-mt-36">
            <SectionTitle>Documentos disponibilizados</SectionTitle>
            <div className="space-y-4">
              {documentos.map((doc) => (
                <DocumentListItem key={doc.id} documento={doc} />
              ))}
            </div>
          </section>
        )}

        {projeto && (
          <section id="pesquisa" className="scroll-mt-36">
            <SectionTitle>Projeto de pesquisa</SectionTitle>
            <Link href="/responsavel/pesquisa" className="block rounded-card">
              <Card className="transition duration-150 hover:-translate-y-0.5 hover:shadow-elevated">
                <CardBody className="flex items-center gap-4">
                  <IconTile icon={FlaskConical} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-muted">Seu animal participa de</p>
                    <p className="text-base font-semibold text-ink">{projeto.nome}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-faint" />
                </CardBody>
              </Card>
            </Link>
          </section>
        )}
      </div>
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
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-surfaceMuted/70 p-4 text-center">
      <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-muted shadow-soft">
        {rotulo}
      </span>
      {avaliacao.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avaliacao.fotoUrl}
          alt={`Foto — ${rotulo.toLowerCase()}`}
          className="h-20 w-20 rounded-control border border-line object-cover"
        />
      ) : (
        <BodySilhouette escore={avaliacao.escoreCorporal} tamanho="sm" />
      )}
      <p className="numeric text-lg font-bold text-ink">{formatarPeso(avaliacao.peso)}</p>
      <Badge tom={tom}>ECC {avaliacao.escoreCorporal}</Badge>
      <p className="text-sm text-ink-muted">{formatarDataCurta(avaliacao.data)}</p>
    </div>
  );
}
