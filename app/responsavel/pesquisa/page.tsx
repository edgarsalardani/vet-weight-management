"use client";

import { useEffect, useState } from "react";
import { FlaskConical, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
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

  if (carregando) return <Spinner label="Carregando projeto…" />;

  if (!projeto || !participacao) {
    return (
      <div className="mx-auto max-w-2xl">
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
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Projeto de pesquisa"
        subtitulo={projeto.nome}
        voltarPara="/responsavel"
      />

      <Card>
        <CardBody>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <span className="text-xs text-ink-faint">Situação da participação:</span>
            <Badge tom={TOM_STATUS_PARTICIPACAO[participacao.status]}>
              {STATUS_PARTICIPACAO_LABELS[participacao.status]}
            </Badge>
          </div>
        </CardBody>
      </Card>

      {proximaAtividade && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-medium text-ink">Próxima atividade</h2>
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-ink">{proximaAtividade.titulo}</p>
              <p className="numeric text-xs text-ink-muted">
                Prazo: {formatarDataCurta(proximaAtividade.data)}
              </p>
            </CardHeader>
            {proximaAtividade.instrucao && (
              <CardBody>
                <p className="text-sm text-ink-muted">{proximaAtividade.instrucao}</p>
              </CardBody>
            )}
          </Card>
        </div>
      )}

      {questionario && (
        <div className="mt-4">
          <QuestionnaireForm
            questionario={questionario}
            animalId={sessao!.animalId!}
            jaRespondido={jaRespondido}
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-ink">Cronograma</h2>
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
      </div>

      {documentos.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-ink">
            <FileText className="h-4 w-4" />
            Documentos disponibilizados
          </h2>
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
        </div>
      )}
    </div>
  );
}
