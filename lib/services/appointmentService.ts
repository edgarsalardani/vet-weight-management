import { COMPROMISSOS_MOCK } from "@/lib/mock-data";
import { Compromisso, NovoCompromisso } from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados da agenda.
 * Ver comentário em animalService.ts sobre a futura troca por Supabase.
 * Tabela futura: `appointments` (FK animal_id -> patients.id,
 * project_id -> research_projects.id quando aplicável).
 */

let compromissosEmMemoria: Compromisso[] = [...COMPROMISSOS_MOCK];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

function ordenarPorData(lista: Compromisso[]): Compromisso[] {
  return [...lista].sort((a, b) => a.data.localeCompare(b.data));
}

/** Lista todos os compromissos (agenda geral da veterinária), em ordem cronológica. */
export async function listarCompromissos(): Promise<Compromisso[]> {
  return delay(ordenarPorData(compromissosEmMemoria));
}

export async function listarCompromissosPorAnimal(
  animalId: string
): Promise<Compromisso[]> {
  const lista = compromissosEmMemoria.filter((c) => c.animalId === animalId);
  return delay(ordenarPorData(lista));
}

/** Retorna o próximo compromisso agendado (data futura mais próxima) de um animal. */
export async function buscarProximoCompromisso(
  animalId: string,
  tipo?: Compromisso["tipo"]
): Promise<Compromisso | null> {
  const hoje = new Date().toISOString().slice(0, 10);
  const lista = ordenarPorData(
    compromissosEmMemoria.filter(
      (c) =>
        c.animalId === animalId &&
        c.status === "agendado" &&
        c.data >= hoje &&
        (!tipo || c.tipo === tipo)
    )
  );
  return delay(lista[0] ?? null);
}

export async function criarCompromisso(
  dados: NovoCompromisso
): Promise<Compromisso> {
  const novo: Compromisso = {
    ...dados,
    statusConfirmacao:
      dados.statusConfirmacao ??
      (dados.tipo === "retorno_clinico" ? "aguardando" : undefined),
    id: gerarId("compr"),
    criadoEm: new Date().toISOString(),
  };
  compromissosEmMemoria = [novo, ...compromissosEmMemoria];
  return delay(novo, 400);
}

/**
 * Simula a confirmação de presença pelo responsável. O responsável nunca
 * altera a agenda da veterinária diretamente — apenas este status muda.
 */
export async function confirmarPresenca(
  compromissoId: string
): Promise<Compromisso | null> {
  let atualizado: Compromisso | null = null;
  compromissosEmMemoria = compromissosEmMemoria.map((c) => {
    if (c.id !== compromissoId) return c;
    atualizado = { ...c, statusConfirmacao: "confirmado" };
    return atualizado;
  });
  return delay(atualizado, 350);
}

/**
 * Simula o registro de uma solicitação de remarcação pelo responsável.
 * Não reagenda automaticamente — apenas sinaliza para a veterinária tratar.
 */
export async function solicitarRemarcacao(
  compromissoId: string
): Promise<Compromisso | null> {
  let atualizado: Compromisso | null = null;
  compromissosEmMemoria = compromissosEmMemoria.map((c) => {
    if (c.id !== compromissoId) return c;
    atualizado = { ...c, statusConfirmacao: "remarcacao_solicitada" };
    return atualizado;
  });
  return delay(atualizado, 350);
}
