"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  History,
  TrendingUp,
  FileText,
  ClipboardList,
  FolderOpen,
  Share2,
  ChevronRight,
  CalendarClock,
  FlaskConical,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { NavCard } from "@/components/ui/NavCard";
import { MetricTile } from "@/components/ui/MetricTile";
import { Button } from "@/components/ui/Button";
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
import { PORTE_LABELS, SEXO_LABELS, classificarEscore } from "@/lib/constants";
import {
  calcularIdadeTexto,
  calcularVariacaoPercentual,
  formatarDataCurta,
  formatarDiaSemana,
  formatarPercentualComSinal,
  formatarPeso,
} from "@/lib/utils";

const TOM_POR_CATEGORIA = {
  low: "low",
  ideal: "ideal",
  high: "high",
} as const;

export default function DetalhesAnimalPage({
  params,
}: {
  params: { id: string };
}) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [recomendacaoAtual, setRecomendacaoAtual] = useState<Recomendacao | null>(null);
  const [proximoRetorno, setProximoRetorno] = useState<Compromisso | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [projeto, setProjeto] = useState<ProjetoPesquisa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true);
      const [a, avals, rec, retorno, docs, participacao] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarAvaliacoesPorAnimal(params.id),
        buscarRecomendacaoAtual(params.id),
        buscarProximoCompromisso(params.id, "retorno_clinico"),
        listarDocumentosPorAnimal(params.id),
        buscarParticipacaoPorAnimal(params.id),
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
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando paciente…" />;

  if (!animal) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-base text-ink-muted">Animal não encontrado.</p>
        <Link href="/dashboard" className="mt-3 inline-block text-base font-semibold text-primary hover:underline">
          Voltar ao dashboard
        </Link>
      </div>
    );
  }

  const ultima = avaliacoes[avaliacoes.length - 1] ?? null;
  const inicial = avaliacoes[0] ?? null;
  const faixa = ultima ? classificarEscore(ultima.escoreCorporal) : null;
  const temAvaliacoes = avaliacoes.length > 0;
  const temHistoricoParaEvolucao = avaliacoes.length >= 2;
  const variacaoDesdeInicio =
    temHistoricoParaEvolucao && inicial && ultima
      ? calcularVariacaoPercentual(inicial.peso, ultima.peso)
      : null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader titulo="Paciente" voltarPara="/dashboard" />

      {/* Ficha do paciente: dados clínicos essenciais sempre visíveis */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary-50 via-white to-white p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  {animal.nome}
                </h2>
                {faixa && (
                  <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]}>
                    {faixa.label}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-base text-ink-muted">
                {animal.raca} · {SEXO_LABELS[animal.sexo]} · {PORTE_LABELS[animal.porte]}
              </p>
              <p className="mt-0.5 text-base text-ink-muted">
                {calcularIdadeTexto(animal.dataNascimento)} · Responsável:{" "}
                <span className="font-semibold text-ink">{animal.responsavelNome}</span>
              </p>
            </div>
          </div>

          {ultima ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <MetricTile
                label="Peso atual"
                valor={formatarPeso(ultima.peso)}
                detalhe={
                  variacaoDesdeInicio !== null
                    ? `${formatarPercentualComSinal(variacaoDesdeInicio)} desde o início`
                    : undefined
                }
              />
              <MetricTile
                label="Escore corporal"
                valor={`${ultima.escoreCorporal} / 9`}
                detalhe={faixa?.label}
              />
              <MetricTile
                label="Massa gorda"
                valor={ultima.massaGorda != null ? `${ultima.massaGorda}%` : "—"}
              />
              <MetricTile
                label="Massa magra"
                valor={ultima.massaMagra != null ? `${ultima.massaMagra}%` : "—"}
              />
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-line bg-white/70 p-4 text-base text-ink-muted">
              Nenhuma avaliação registrada ainda. Registre a primeira para ver os indicadores do paciente.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {ultima && (
              <p className="text-sm text-ink-muted">
                Última avaliação em{" "}
                <span className="font-semibold text-ink">{formatarDataCurta(ultima.data)}</span>
              </p>
            )}
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <CalendarClock className="h-4 w-4" />
              {proximoRetorno
                ? `Próximo retorno: ${formatarDiaSemana(proximoRetorno.data)}, ${formatarDataCurta(proximoRetorno.data)}${
                    proximoRetorno.horario ? ` às ${proximoRetorno.horario}` : ""
                  }`
                : "Nenhum retorno agendado"}
            </Link>
          </div>
        </div>
      </Card>

      {projeto && (
        <Link href={`/pesquisa/${projeto.id}`} className="mt-4 block rounded-card">
          <div className="flex items-center gap-3 rounded-card border border-primary/20 bg-primary-50 px-4 py-3.5 text-primary-dark transition duration-150 hover:border-primary/40 hover:shadow-card">
            <FlaskConical className="h-5 w-5 shrink-0" />
            <p className="min-w-0 flex-1 text-sm">
              Participa do projeto de pesquisa{" "}
              <span className="font-semibold">{projeto.nome}</span>
            </p>
            <ChevronRight className="h-5 w-5 shrink-0" />
          </div>
        </Link>
      )}

      <div className="mt-6">
        <Link href={`/animais/${animal.id}/avaliacoes/nova`} className="block sm:inline-block">
          <Button size="md" full className="sm:w-auto">
            <CalendarPlus className="h-5 w-5" />
            Nova avaliação corporal
          </Button>
        </Link>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold tracking-tight text-ink">
        Acompanhamento
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NavCard
          href={`/animais/${animal.id}/evolucao`}
          icon={TrendingUp}
          titulo="Ver evolução"
          descricao={
            temHistoricoParaEvolucao
              ? "Peso, ECC, composição e ilustração"
              : "Disponível a partir de 2 avaliações"
          }
          desabilitado={!temHistoricoParaEvolucao}
        />
        <NavCard
          href={`/animais/${animal.id}/avaliacoes`}
          icon={History}
          titulo="Histórico"
          descricao={
            temAvaliacoes
              ? `${avaliacoes.length} ${avaliacoes.length === 1 ? "registro" : "registros"}`
              : "Nenhum registro ainda"
          }
        />
        <NavCard
          href={`/animais/${animal.id}/relatorio`}
          icon={FileText}
          titulo="Relatório pós-retorno"
          descricao={
            temAvaliacoes ? "Resumo do retorno mais recente" : "Disponível após a primeira avaliação"
          }
          desabilitado={!temAvaliacoes}
        />
        <NavCard
          href={`/animais/${animal.id}/recomendacoes`}
          icon={ClipboardList}
          titulo="Recomendações"
          descricao={
            recomendacaoAtual
              ? `Vigente desde ${formatarDataCurta(recomendacaoAtual.data)}`
              : "Nenhuma recomendação registrada"
          }
        />
        <NavCard
          href={`/animais/${animal.id}/documentos`}
          icon={FolderOpen}
          titulo="Documentos e exames"
          descricao={
            documentos.length > 0
              ? `${documentos.length} ${documentos.length === 1 ? "documento" : "documentos"}`
              : "Nenhum documento"
          }
        />
      </div>

      <Link
        href={`/compartilhar/${animal.id}`}
        className="mt-8 flex items-center justify-center gap-2 rounded-control py-3 text-sm font-semibold text-primary hover:underline"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar resumo com o responsável
      </Link>
    </div>
  );
}
