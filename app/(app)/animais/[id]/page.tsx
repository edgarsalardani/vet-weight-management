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
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { NavCard } from "@/components/ui/NavCard";
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
  formatarDataCurta,
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

  if (carregando) return <Spinner label="Carregando paciente…" />;

  if (!animal) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-ink-muted">Animal não encontrado.</p>
        <Link href="/dashboard" className="mt-2 inline-block text-sm text-primary">
          Voltar ao dashboard
        </Link>
      </div>
    );
  }

  const ultima = avaliacoes[avaliacoes.length - 1] ?? null;
  const faixa = ultima ? classificarEscore(ultima.escoreCorporal) : null;
  const temAvaliacoes = avaliacoes.length > 0;
  const temHistoricoParaEvolucao = avaliacoes.length >= 2;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader titulo="Paciente" voltarPara="/dashboard" />

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-ink">{animal.nome}</h2>
              {faixa && (
                <Badge tom={TOM_POR_CATEGORIA[faixa.categoria]}>
                  ECC {ultima!.escoreCorporal} · {faixa.label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-ink-muted">{animal.raca}</p>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-ink-faint">Sexo</dt>
                <dd className="text-ink">{SEXO_LABELS[animal.sexo]}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Idade</dt>
                <dd className="text-ink">
                  {calcularIdadeTexto(animal.dataNascimento)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Porte</dt>
                <dd className="text-ink">{PORTE_LABELS[animal.porte]}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Responsável</dt>
                <dd className="text-ink">{animal.responsavelNome}</dd>
              </div>
              {ultima && (
                <div>
                  <dt className="text-xs text-ink-faint">Peso atual</dt>
                  <dd className="numeric font-medium text-ink">
                    {formatarPeso(ultima.peso)}
                  </dd>
                </div>
              )}
              {ultima && (
                <div>
                  <dt className="text-xs text-ink-faint">Última avaliação</dt>
                  <dd className="text-ink">{formatarDataCurta(ultima.data)}</dd>
                </div>
              )}
            </dl>
          </div>
        </CardBody>
      </Card>

      {projeto && (
        <Link href={`/pesquisa/${projeto.id}`} className="mt-3 block">
          <div className="flex items-center gap-3 rounded-card border border-primary/30 bg-primary-light/50 p-3.5 text-primary-dark transition-colors hover:border-primary/60">
            <FlaskConical className="h-4.5 w-4.5 shrink-0" />
            <p className="min-w-0 flex-1 truncate text-sm">
              Participa do projeto de pesquisa{" "}
              <span className="font-medium">{projeto.nome}</span>
            </p>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </div>
        </Link>
      )}

      <div className="mt-5">
        <Link href={`/animais/${animal.id}/avaliacoes/nova`}>
          <div className="flex items-center gap-3 rounded-card bg-primary px-4 py-3.5 text-white shadow-card transition-colors hover:bg-primary-dark">
            <CalendarPlus className="h-5 w-5" />
            <span className="flex-1 font-medium">Nova avaliação corporal</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NavCard
          href={`/animais/${animal.id}/evolucao`}
          icon={TrendingUp}
          titulo="Ver evolução"
          descricao="Peso, ECC, composição e representação visual"
          desabilitado={!temHistoricoParaEvolucao}
        />
        <NavCard
          href={`/animais/${animal.id}/avaliacoes`}
          icon={History}
          titulo="Histórico"
          descricao={
            temAvaliacoes
              ? `${avaliacoes.length} ${
                  avaliacoes.length === 1 ? "registro" : "registros"
                }`
              : "Nenhum registro ainda"
          }
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
              ? `${documentos.length} ${
                  documentos.length === 1 ? "documento" : "documentos"
                }`
              : "Nenhum documento"
          }
        />
        <NavCard
          href={`/animais/${animal.id}/relatorio`}
          icon={FileText}
          titulo="Relatório pós-retorno"
          descricao="Resumo do retorno mais recente"
          desabilitado={!temAvaliacoes}
        />
        <NavCard
          href="/agenda"
          icon={CalendarClock}
          titulo="Próximo retorno"
          descricao={
            proximoRetorno
              ? `${formatarDataCurta(proximoRetorno.data)}${
                  proximoRetorno.horario ? ` às ${proximoRetorno.horario}` : ""
                }`
              : "Nenhum retorno agendado"
          }
        />
      </div>

      <Link
        href={`/compartilhar/${animal.id}`}
        className="mt-4 flex items-center justify-center gap-1.5 py-2 text-sm text-primary hover:underline"
      >
        <Share2 className="h-3.5 w-3.5" />
        Compartilhar resumo com o responsável
      </Link>
    </div>
  );
}
