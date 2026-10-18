"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
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

  if (carregando) return <Spinner label="Carregando projeto…" />;

  if (!projeto) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-ink-muted">Projeto não encontrado.</p>
        <Link href="/pesquisa" className="mt-2 inline-block text-sm text-primary">
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  const documentos = DOCUMENTOS_PROJETO_MOCK[projeto.id] ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo={projeto.nome}
        subtitulo="Projeto de pesquisa"
        voltarPara="/pesquisa"
      />

      <Card>
        <CardBody>
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge tom={TOM_STATUS_PROJETO[projeto.status]}>
              {STATUS_PROJETO_LABELS[projeto.status]}
            </Badge>
            <span className="text-xs text-ink-muted">
              {formatarDataCurta(projeto.periodoInicio)}
              {projeto.periodoFim
                ? ` – ${formatarDataCurta(projeto.periodoFim)}`
                : ""}
            </span>
          </div>
          <p className="text-sm text-ink">{projeto.descricao}</p>
        </CardBody>
      </Card>

      <div className="mt-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-ink">
          <Users className="h-4 w-4" />
          Participantes ({participantes.length})
        </h2>
        {participantes.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhum animal vinculado ainda.</p>
        ) : (
          <div className="space-y-2.5">
            {participantes.map(({ participacao, animal }) => (
              <Link
                key={participacao.id}
                href={`/animais/${animal.id}`}
                className="flex items-center gap-3 rounded-card border border-line bg-surface p-3.5 shadow-card transition-colors hover:border-primary/40"
              >
                <AnimalAvatar nome={animal.nome} fotoUrl={animal.fotoUrl} tamanho="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{animal.nome}</p>
                  <p className="truncate text-xs text-ink-muted">
                    Responsável: {animal.responsavelNome}
                  </p>
                </div>
                <Badge tom={TOM_STATUS_PARTICIPACAO[participacao.status]}>
                  {STATUS_PARTICIPACAO_LABELS[participacao.status]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-ink">Cronograma</h2>
        {atividades.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhuma atividade cadastrada.</p>
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
      </div>

      {questionarios.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-ink">Questionários</h2>
          <div className="space-y-2.5">
            {questionarios.map((q) => (
              <Card key={q.id}>
                <CardBody className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">{q.titulo}</p>
                    <p className="text-xs text-ink-muted">
                      {q.perguntas.length}{" "}
                      {q.perguntas.length === 1 ? "pergunta" : "perguntas"} ·
                      preenchido pelo responsável
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-ink">
          <FileText className="h-4 w-4" />
          Documentos do projeto
        </h2>
        {documentos.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhum documento cadastrado.</p>
        ) : (
          <div className="space-y-2.5">
            {documentos.map((doc) => (
              <Card key={doc.titulo}>
                <CardBody>
                  <p className="text-sm font-medium text-ink">{doc.titulo}</p>
                  <p className="text-xs text-ink-muted">{doc.descricao}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-ink-faint">
          Documentos e consentimentos devem seguir os procedimentos éticos
          aprovados para este projeto (TCLE, CEUA/CEP ou equivalente). Este
          protótipo não realiza assinatura digital nem substitui esses
          procedimentos.
        </p>
      </div>
    </div>
  );
}
