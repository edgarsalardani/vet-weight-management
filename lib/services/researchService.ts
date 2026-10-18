import {
  ANIMAIS_MOCK,
  ATIVIDADES_PESQUISA_MOCK,
  PARTICIPACOES_PESQUISA_MOCK,
  PROJETOS_PESQUISA_MOCK,
  QUESTIONARIOS_MOCK,
} from "@/lib/mock-data";
import {
  Animal,
  AtividadePesquisa,
  ParticipacaoPesquisa,
  ProjetoPesquisa,
  Questionario,
  RespostaQuestionario,
} from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados do módulo de Projetos de Pesquisa.
 * Ver comentário em animalService.ts sobre a futura troca por Supabase.
 * Tabelas futuras: `research_projects`, `research_participants`,
 * `research_activities`, `research_questionnaires`,
 * `research_questionnaire_responses`.
 *
 * Este módulo é independente do acompanhamento corporal — compartilha
 * apenas o cadastro de animais (via `animalId` em `ParticipacaoPesquisa`).
 */

let projetosEmMemoria: ProjetoPesquisa[] = [...PROJETOS_PESQUISA_MOCK];
let participacoesEmMemoria: ParticipacaoPesquisa[] = [
  ...PARTICIPACOES_PESQUISA_MOCK,
];
let atividadesEmMemoria: AtividadePesquisa[] = [...ATIVIDADES_PESQUISA_MOCK];
const questionariosEmMemoria: Questionario[] = [...QUESTIONARIOS_MOCK];
let respostasEmMemoria: RespostaQuestionario[] = [];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

export async function listarProjetos(): Promise<ProjetoPesquisa[]> {
  return delay([...projetosEmMemoria].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
}

export async function buscarProjetoPorId(
  id: string
): Promise<ProjetoPesquisa | null> {
  return delay(projetosEmMemoria.find((p) => p.id === id) ?? null);
}

/** Quantidade de animais participantes de um projeto (para o card de listagem). */
export async function contarParticipantes(projetoId: string): Promise<number> {
  return delay(
    participacoesEmMemoria.filter((p) => p.projetoId === projetoId).length
  );
}

export interface ParticipanteDetalhado {
  participacao: ParticipacaoPesquisa;
  animal: Animal;
}

export async function listarParticipantesPorProjeto(
  projetoId: string
): Promise<ParticipanteDetalhado[]> {
  const participacoes = participacoesEmMemoria.filter(
    (p) => p.projetoId === projetoId
  );
  const detalhados = participacoes
    .map((participacao) => {
      const animal = ANIMAIS_MOCK.find((a) => a.id === participacao.animalId);
      return animal ? { participacao, animal } : null;
    })
    .filter((v): v is ParticipanteDetalhado => v !== null);
  return delay(detalhados);
}

/** Retorna a participação ativa de um animal (se houver), com os dados do projeto. */
export async function buscarParticipacaoPorAnimal(
  animalId: string
): Promise<{ participacao: ParticipacaoPesquisa; projeto: ProjetoPesquisa } | null> {
  const participacao = participacoesEmMemoria.find(
    (p) => p.animalId === animalId && p.status === "ativo"
  );
  if (!participacao) return delay(null);
  const projeto = projetosEmMemoria.find((p) => p.id === participacao.projetoId);
  if (!projeto) return delay(null);
  return delay({ participacao, projeto });
}

export async function listarAtividadesPorProjeto(
  projetoId: string
): Promise<AtividadePesquisa[]> {
  const lista = atividadesEmMemoria
    .filter((a) => a.projetoId === projetoId)
    .sort((a, b) => a.data.localeCompare(b.data));
  return delay(lista);
}

/** Próxima atividade não concluída de um projeto (usada na área do responsável). */
export async function buscarProximaAtividade(
  projetoId: string
): Promise<AtividadePesquisa | null> {
  const lista = await listarAtividadesPorProjeto(projetoId);
  return lista.find((a) => a.status !== "concluido") ?? null;
}

export async function listarQuestionariosPorProjeto(
  projetoId: string
): Promise<Questionario[]> {
  return delay(questionariosEmMemoria.filter((q) => q.projetoId === projetoId));
}

export async function buscarQuestionarioPorId(
  id: string
): Promise<Questionario | null> {
  return delay(questionariosEmMemoria.find((q) => q.id === id) ?? null);
}

export async function buscarRespostaQuestionario(
  questionarioId: string,
  animalId: string
): Promise<RespostaQuestionario | null> {
  return delay(
    respostasEmMemoria.find(
      (r) => r.questionarioId === questionarioId && r.animalId === animalId
    ) ?? null
  );
}

/** Simula o envio das respostas de um questionário (sem backend). */
export async function responderQuestionario(
  questionarioId: string,
  animalId: string,
  respostas: Record<string, string>
): Promise<RespostaQuestionario> {
  const nova: RespostaQuestionario = {
    id: gerarId("resp"),
    questionarioId,
    animalId,
    respostas,
    enviadoEm: new Date().toISOString(),
  };
  respostasEmMemoria = [nova, ...respostasEmMemoria];
  return delay(nova, 400);
}
