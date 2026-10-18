"use client";

import { useEffect, useState } from "react";
import { FlaskConical, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActivityTimelineItem } from "@/components/research/ActivityTimelineItem";
import { QuestionnaireForm } from "@/components/research/QuestionnaireForm";
import {
  buscarParticipacaoPorAnimal,
  buscarProximaAtividade,
  buscarQuestionarioPorId,
  buscarRespostaQuestionario,
  listarAtividadesPorProjeto,
} from "@/lib/services/researchService";
import { DOCUMENTOS_PROJETO_MOCK } from "@/lib/mock-data";
import {
  AtividadePesquisa,
  ParticipacaoPesquisa,
  ProjetoPesquisa,
  Questionario,
} from "@/lib/types";
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

export default function ProjetoDoResponsavelPage() {
  const { sessao } = useAuth();
  const [projeto, setProjeto] = useState<ProjetoPesquisa | null>(null);
  const [participacao, setParticipacao] = useState<ParticipacaoPesquisa | null>(null);
  const [proximaAtividade, setProximaAtividade] = useState<AtividadePesquisa | null>(null);
  const [atividades, setAtividades] = useState<AtividadePesquisa[]>([]);
  const [questionario, setQuestionario] = useState<Questionario | null>(null);
  const [jaRespondido, setJaRespondido] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!sessao?.animalId) return;
    let ativo = true;
    async function carregar() {
      const resultado = await buscarParticipacaoPorAnimal(sessao!.animalId!);
      if (!ativo) return;
      if (!resultado) {
        setCarregando(false);
        return;
      }
      const [proxima, todasAtividades] = await Promise.all([
        buscarProximaAtividade(resultado.projeto.id),
        listarAtividadesPorProjeto(resultado.projeto.id),
      ]);
      if (!ativo) return;
      setProjeto(resultado.projeto);
      setParticipacao(resultado.participacao);
      setProximaAtividade(proxima);
      setAtividades(todasAtividades);

      if (proxima?.questionarioId) {
        const [q, resposta] = await Promise.all([
          buscarQuestionarioPorId(proxima.questionarioId),
          buscarRespostaQuestionario(proxima.questionarioId, sessao!.animalId!),
        ]);
        if (!ativo) return;
        setQuestionario(q);
        setJaRespondido(Boolean(resposta));
      }
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [sessao]);

  if (carregando) return <PageSkeleton label="Carregando projeto…" />;

  if (!projeto || !participacao) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader titulo="Projeto de pesquisa" voltarPara="/responsavel" />
        <EmptyState
          icon={FlaskConical}
          titulo="Nenhum projeto vinculado"
          descricao="Seu animal não participa de nenhum projeto de pesquisa no momento."
        />
      </div>
    );
  }

  const documentos = DOCUMENTOS_PROJETO_MOCK[projeto.id] ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Projeto de pesquisa"
        subtitulo={projeto.nome}
        voltarPara="/responsavel"
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
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/70 pt-4">
            <span className="text-sm text-ink-muted">Situação da participação:</span>
            <Badge tom={TOM_STATUS_PARTICIPACAO[participacao.status]}>
              {STATUS_PARTICIPACAO_LABELS[participacao.status]}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="mt-8 space-y-8">
        {proximaAtividade && (
          <section>
            <SectionTitle>Próxima atividade</SectionTitle>
            <Card>
              <CardBody>
                <p className="text-base font-bold text-ink">{proximaAtividade.titulo}</p>
                <p className="numeric mt-0.5 text-sm font-semibold text-primary">
                  Prazo: {formatarDataCurta(proximaAtividade.data)}
                </p>
                {proximaAtividade.instrucao && (
                  <p className="mt-3 rounded-2xl bg-primary-50 px-4 py-3 text-base text-ink">
                    {proximaAtividade.instrucao}
                  </p>
                )}
              </CardBody>
            </Card>
          </section>
        )}

        {questionario && (
          <section>
            <QuestionnaireForm
              questionario={questionario}
              animalId={sessao!.animalId!}
              jaRespondido={jaRespondido}
            />
          </section>
        )}

        <section>
          <SectionTitle>Cronograma</SectionTitle>
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
        </section>

        {documentos.length > 0 && (
          <section>
            <SectionTitle>
              <span className="inline-flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documentos disponibilizados
              </span>
            </SectionTitle>
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
          </section>
        )}
      </div>
    </div>
  );
}
