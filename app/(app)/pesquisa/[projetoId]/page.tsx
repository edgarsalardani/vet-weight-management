"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { ActivityTimelineItem } from "@/components/research/ActivityTimelineItem";
import {
  buscarProjetoPorId,
  listarAtividadesPorProjeto,
  listarParticipantesPorProjeto,
  listarQuestionariosPorProjeto,
  ParticipanteDetalhado,
} from "@/lib/services/researchService";
import { DOCUMENTOS_PROJETO_MOCK } from "@/lib/mock-data";
import { AtividadePesquisa, ProjetoPesquisa, Questionario } from "@/lib/types";
import {
  STATUS_PARTICIPACAO_LABELS,
  STATUS_PROJETO_LABELS,
} from "@/lib/constants";
import { formatarDataCurta } from "@/lib/utils";

const TOM_STATUS_PROJETO = {
  planejado: "low",
  em_andamento: "ideal",
  concluido: "neutral",
} as const;

const TOM_STATUS_PARTICIPACAO = {
  ativo: "ideal",
  concluido: "neutral",
  inativo: "low",
} as const;

export default function ProjetoPesquisaPage({
  params,
}: {
  params: { projetoId: string };
}) {
  const [projeto, setProjeto] = useState<ProjetoPesquisa | null>(null);
  const [participantes, setParticipantes] = useState<ParticipanteDetalhado[]>([]);
  const [atividades, setAtividades] = useState<AtividadePesquisa[]>([]);
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [p, parts, ativs, quests] = await Promise.all([
        buscarProjetoPorId(params.projetoId),
        listarParticipantesPorProjeto(params.projetoId),
        listarAtividadesPorProjeto(params.projetoId),
        listarQuestionariosPorProjeto(params.projetoId),
      ]);
      if (!ativo) return;
      setProjeto(p);
      setParticipantes(parts);
      setAtividades(ativs);
      setQuestionarios(quests);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.projetoId]);

  if (carregando) return <PageSkeleton label="Carregando projeto…" />;

  if (!projeto) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-base text-ink-muted">Projeto não encontrado.</p>
        <Link href="/pesquisa" className="mt-2 inline-block text-sm text-primary">
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  const documentos = DOCUMENTOS_PROJETO_MOCK[projeto.id] ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titulo={projeto.nome}
        subtitulo="Projeto de pesquisa"
        voltarPara="/pesquisa"
      />

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary-50 via-white to-white p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Badge tom={TOM_STATUS_PROJETO[projeto.status]}>
              {STATUS_PROJETO_LABELS[projeto.status]}
            </Badge>
            <span className="text-sm font-medium text-ink-muted">
              {formatarDataCurta(projeto.periodoInicio)}
              {projeto.periodoFim ? ` a ${formatarDataCurta(projeto.periodoFim)}` : ""}
            </span>
          </div>
          <p className="text-base text-ink">{projeto.descricao}</p>
        </div>
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <section>
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Participantes ({participantes.length})
            </span>
          </SectionTitle>
          {participantes.length === 0 ? (
            <p className="text-base text-ink-muted">Nenhum animal vinculado ainda.</p>
          ) : (
            <div className="space-y-3">
              {participantes.map(({ participacao, animal }) => (
                <Link
                  key={participacao.id}
                  href={`/animais/${animal.id}`}
                  className="group block rounded-card"
                >
                  <div className="flex items-center gap-4 rounded-card border border-line/70 bg-surface p-4 shadow-card transition duration-150 group-hover:-translate-y-0.5 group-hover:shadow-elevated">
                    <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-ink">{animal.nome}</p>
                      <p className="truncate text-sm text-ink-muted">
                        Responsável: {animal.responsavelNome}
                      </p>
                    </div>
                    <Badge tom={TOM_STATUS_PARTICIPACAO[participacao.status]}>
                      {STATUS_PARTICIPACAO_LABELS[participacao.status]}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionTitle>Cronograma</SectionTitle>
          {atividades.length === 0 ? (
            <p className="text-base text-ink-muted">Nenhuma atividade cadastrada.</p>
          ) : (
            <Card>
              <CardBody>
                {atividades.map((atividade, i) => (
                  <ActivityTimelineItem
                    key={atividade.id}
                    atividade={atividade}
                    ultimo={i === atividades.length - 1}
                  />
                ))}
              </CardBody>
            </Card>
          )}
        </section>
      </div>

      {questionarios.length > 0 && (
        <section className="mt-8">
          <SectionTitle>Questionários</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {questionarios.map((q) => (
              <Card key={q.id}>
                <CardBody>
                  <p className="text-base font-bold text-ink">{q.titulo}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {q.perguntas.length} {q.perguntas.length === 1 ? "pergunta" : "perguntas"} ·
                    preenchido pelo responsável
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentos do projeto
          </span>
        </SectionTitle>
        {documentos.length === 0 ? (
          <p className="text-base text-ink-muted">Nenhum documento cadastrado.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documentos.map((doc) => (
              <Card key={doc.titulo}>
                <CardBody>
                  <p className="text-base font-bold text-ink">{doc.titulo}</p>
                  <p className="mt-1 text-sm text-ink-muted">{doc.descricao}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        <p className="mt-4 rounded-2xl bg-primary-50 px-4 py-3.5 text-sm text-ink-muted">
          Documentos e consentimentos devem seguir os procedimentos éticos
          aprovados para este projeto (TCLE, CEUA/CEP ou equivalente). Este
          protótipo não realiza assinatura digital nem substitui esses
          procedimentos.
        </p>
      </section>
    </div>
  );
}
