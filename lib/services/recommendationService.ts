import { RECOMENDACOES_MOCK } from "@/lib/mock-data";
import { NovaRecomendacao, Recomendacao } from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados das recomendações / plano de manejo.
 * Ver comentário em animalService.ts sobre a futura troca por Supabase.
 * Tabela futura: `recommendations` (FK animal_id -> patients.id).
 */

let recomendacoesEmMemoria: Recomendacao[] = [...RECOMENDACOES_MOCK];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

/** Lista as recomendações de um animal, da mais antiga para a mais recente. */
export async function listarRecomendacoesPorAnimal(
  animalId: string
): Promise<Recomendacao[]> {
  const lista = recomendacoesEmMemoria
    .filter((r) => r.animalId === animalId)
    .sort((a, b) => a.data.localeCompare(b.data));
  return delay(lista);
}

/** Retorna a recomendação vigente (mais recente) de um animal, se houver. */
export async function buscarRecomendacaoAtual(
  animalId: string
): Promise<Recomendacao | null> {
  const lista = await listarRecomendacoesPorAnimal(animalId);
  return lista[lista.length - 1] ?? null;
}

export async function criarRecomendacao(
  dados: NovaRecomendacao
): Promise<Recomendacao> {
  const nova: Recomendacao = {
    ...dados,
    id: gerarId("rec"),
    criadoEm: new Date().toISOString(),
  };
  recomendacoesEmMemoria = [nova, ...recomendacoesEmMemoria];
  return delay(nova, 400);
}
