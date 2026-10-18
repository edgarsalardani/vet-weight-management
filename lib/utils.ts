import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Combina classes do clsx (alias usado nos componentes de UI). */
export const cx = cn;

/**
 * Calcula a idade de um animal a partir da data de nascimento (ISO date),
 * retornando um texto amigável em português (ex.: "2 anos e 3 meses").
 */
export function calcularIdadeTexto(dataNascimentoISO: string): string {
  const nascimento = new Date(dataNascimentoISO + "T00:00:00");
  const hoje = new Date();

  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();

  if (hoje.getDate() < nascimento.getDate()) {
    meses -= 1;
  }
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  if (anos <= 0 && meses <= 0) {
    return "Recém-nascido";
  }
  if (anos <= 0) {
    return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  }
  if (meses === 0) {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }
  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${
    meses === 1 ? "mês" : "meses"
  }`;
}

const MESES_ABREV = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const MESES_COMPLETOS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Nome completo do mês em português a partir do número (1-12). */
export function nomeDoMes(mes: number): string {
  return MESES_COMPLETOS[mes - 1] ?? "";
}

/** Formata uma data ISO (yyyy-mm-dd) como "12 mar 2025". */
export function formatarDataCurta(dataISO: string): string {
  const d = new Date(dataISO + "T00:00:00");
  return `${d.getDate()} ${MESES_ABREV[d.getMonth()]} ${d.getFullYear()}`;
}

/** Formata uma data ISO (yyyy-mm-dd) como "12/03/2025". */
export function formatarDataNumerica(dataISO: string): string {
  const d = new Date(dataISO + "T00:00:00");
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${d.getFullYear()}`;
}

/** Formata um datetime ISO como data curta + hora. */
export function formatarDataHora(dataISO: string): string {
  const d = new Date(dataISO);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatarDataCurta(d.toISOString().slice(0, 10))} às ${hh}:${mm}`;
}

/** Retorna a variação percentual entre dois valores (ex.: peso inicial -> atual). */
export function calcularVariacaoPercentual(
  valorInicial: number,
  valorAtual: number
): number {
  if (valorInicial === 0) return 0;
  return ((valorAtual - valorInicial) / valorInicial) * 100;
}

/** Formata um número com sinal e uma casa decimal, ex.: "+4.2%" ou "-3.0%". */
export function formatarPercentualComSinal(valor: number): string {
  const sinal = valor > 0 ? "+" : "";
  return `${sinal}${valor.toFixed(1)}%`;
}

/** Formata peso em kg com uma casa decimal. */
export function formatarPeso(pesoKg: number): string {
  return `${pesoKg.toFixed(1)} kg`;
}

/** Gera as iniciais de um nome (até 2 letras) para uso em avatares. */
export function gerarIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

/** Nome do dia da semana (pt-BR) a partir de uma data ISO (yyyy-mm-dd). */
export function formatarDiaSemana(dataISO: string): string {
  const d = new Date(dataISO + "T00:00:00");
  return DIAS_SEMANA[d.getDay()];
}

/** Formata um objeto Date local como "yyyy-mm-dd", sem passar por UTC (evita bug de fuso horário). */
function formatarISO(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Retorna a data ISO (yyyy-mm-dd) N dias a partir de hoje (N pode ser negativo). */
export function dataRelativaAHoje(n: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return formatarISO(d);
}

/** Compõe uma chave "yyyy-mm" a partir de uma data ISO, para agrupar por mês. */
export function chaveDoMes(dataISO: string): string {
  return dataISO.slice(0, 7);
}

/** Gera um id simples no padrão usado pelos dados mockados. */
export function gerarId(prefixo: string): string {
  return `${prefixo}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Soma (ou subtrai) dias a uma data ISO, retornando outra data ISO (yyyy-mm-dd). */
export function adicionarDias(dataISO: string, dias: number): string {
  const d = new Date(dataISO + "T00:00:00");
  d.setDate(d.getDate() + dias);
  return formatarISO(d);
}

/**
 * Diferença em dias de calendário entre hoje e uma data ISO (positiva se a
 * data for no futuro). Usada para decidir quando exibir lembretes de retorno.
 */
export function diasAteData(dataISO: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataISO + "T00:00:00");
  const MS_POR_DIA = 1000 * 60 * 60 * 24;
  return Math.round((alvo.getTime() - hoje.getTime()) / MS_POR_DIA);
}

export interface CelulaCalendario {
  dataISO: string; // yyyy-mm-dd
  noMesAtual: boolean;
}

/**
 * Gera a grade de um calendário mensal em semanas completas
 * (domingo a sábado), incluindo os dias do mês anterior/seguinte
 * necessários para preencher a primeira e a última semana.
 * `mes` é 1-12 (não o índice 0-11 do JS Date).
 */
export function gerarGradeMensal(ano: number, mes: number): CelulaCalendario[] {
  const primeiroDia = new Date(ano, mes - 1, 1);
  const inicioGrade = new Date(primeiroDia);
  inicioGrade.setDate(inicioGrade.getDate() - primeiroDia.getDay());

  const ultimoDia = new Date(ano, mes, 0);
  const fimGrade = new Date(ultimoDia);
  fimGrade.setDate(fimGrade.getDate() + (6 - ultimoDia.getDay()));

  const celulas: CelulaCalendario[] = [];
  const cursor = new Date(inicioGrade);
  while (cursor.getTime() <= fimGrade.getTime()) {
    celulas.push({
      dataISO: formatarISO(cursor),
      noMesAtual: cursor.getMonth() === mes - 1,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return celulas;
}

