import {
  Porte,
  Sexo,
  StatusAtividade,
  StatusCompromisso,
  StatusConfirmacao,
  StatusParticipacao,
  StatusProjeto,
  TipoCompromisso,
} from "@/lib/types";

export const PORTE_LABELS: Record<Porte, string> = {
  pequeno: "Pequeno",
  medio: "Médio",
  grande: "Grande",
  gigante: "Gigante",
};

export const PORTE_OPTIONS: { value: Porte; label: string }[] = (
  Object.keys(PORTE_LABELS) as Porte[]
).map((value) => ({ value, label: PORTE_LABELS[value] }));

export const SEXO_LABELS: Record<Sexo, string> = {
  macho: "Macho",
  femea: "Fêmea",
};

export const SEXO_OPTIONS: { value: Sexo; label: string }[] = (
  Object.keys(SEXO_LABELS) as Sexo[]
).map((value) => ({ value, label: SEXO_LABELS[value] }));

/**
 * Faixas de classificação do Escore de Condição Corporal (ECC), escala 1-9.
 * Referência geral utilizada em rotina clínica veterinária.
 */
export type FaixaEscore = "low" | "ideal" | "high";

export interface EscoreFaixa {
  min: number;
  max: number;
  categoria: FaixaEscore;
  label: string;
}

export const ESCORE_FAIXAS: EscoreFaixa[] = [
  { min: 1, max: 3, categoria: "low", label: "Abaixo do peso" },
  { min: 4, max: 5, categoria: "ideal", label: "Peso ideal" },
  { min: 6, max: 9, categoria: "high", label: "Acima do peso" },
];

export function classificarEscore(escore: number): EscoreFaixa {
  return (
    ESCORE_FAIXAS.find((f) => escore >= f.min && escore <= f.max) ??
    ESCORE_FAIXAS[1]
  );
}

/**
 * Descrição individual de cada um dos 9 níveis do Escore de Condição
 * Corporal. Texto próprio e genérico, escrito para este protótipo — não
 * reproduz material de associações ou publicações veterinárias.
 */
export const ECC_NIVEIS: { nivel: number; label: string; categoria: FaixaEscore }[] = [
  { nivel: 1, label: "Muito abaixo do peso", categoria: "low" },
  { nivel: 2, label: "Muito magro", categoria: "low" },
  { nivel: 3, label: "Magro", categoria: "low" },
  { nivel: 4, label: "Levemente abaixo do ideal", categoria: "ideal" },
  { nivel: 5, label: "Peso ideal", categoria: "ideal" },
  { nivel: 6, label: "Levemente acima do ideal", categoria: "high" },
  { nivel: 7, label: "Sobrepeso", categoria: "high" },
  { nivel: 8, label: "Muito acima do peso", categoria: "high" },
  { nivel: 9, label: "Obesidade", categoria: "high" },
];

/* ------------------------------------------------------------------ */
/* Agenda                                                              */
/* ------------------------------------------------------------------ */

export const TIPO_COMPROMISSO_LABELS: Record<TipoCompromisso, string> = {
  retorno_clinico: "Retorno clínico",
  atividade_pesquisa: "Atividade de pesquisa",
};

export const STATUS_COMPROMISSO_LABELS: Record<StatusCompromisso, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_CONFIRMACAO_LABELS: Record<StatusConfirmacao, string> = {
  aguardando: "Aguardando confirmação",
  confirmado: "Presença confirmada",
  remarcacao_solicitada: "Solicitação de remarcação enviada",
};

export const STATUS_CONFIRMACAO_TOM: Record<
  StatusConfirmacao,
  "low" | "ideal" | "high" | "neutral"
> = {
  aguardando: "low",
  confirmado: "ideal",
  remarcacao_solicitada: "high",
};

/* ------------------------------------------------------------------ */
/* Projetos de pesquisa                                                */
/* ------------------------------------------------------------------ */

export const STATUS_PROJETO_LABELS: Record<StatusProjeto, string> = {
  planejado: "Planejado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export const STATUS_PARTICIPACAO_LABELS: Record<StatusParticipacao, string> = {
  ativo: "Participante ativo",
  concluido: "Participação concluída",
  inativo: "Inativo",
};

export const STATUS_ATIVIDADE_LABELS: Record<StatusAtividade, string> = {
  concluido: "Concluído",
  pendente: "Pendente",
  agendado: "Agendado",
  futuro: "Futuro",
};

export const STATUS_ATIVIDADE_TOM: Record<StatusAtividade, "low" | "ideal" | "high" | "neutral"> = {
  concluido: "ideal",
  pendente: "high",
  agendado: "low",
  futuro: "neutral",
};
