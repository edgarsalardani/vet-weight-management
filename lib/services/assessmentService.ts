import { AVALIACOES_MOCK } from "@/lib/mock-data";
import { AvaliacaoCorporal, NovaAvaliacao } from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados das avaliações corporais.
 * Ver comentário em animalService.ts sobre a futura troca por Supabase.
 * Tabela equivalente futura: `avaliacoes_corporais` (FK animal_id -> animais.id).
 */

let avaliacoesEmMemoria: AvaliacaoCorporal[] = [...AVALIACOES_MOCK];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

function ordenarPorData(lista: AvaliacaoCorporal[]): AvaliacaoCorporal[] {
  return [...lista].sort((a, b) => a.data.localeCompare(b.data));
}

/** Lista as avaliações de um animal, da mais antiga para a mais recente. */
export async function listarAvaliacoesPorAnimal(
  animalId: string
): Promise<AvaliacaoCorporal[]> {
  const lista = avaliacoesEmMemoria.filter((a) => a.animalId === animalId);
  return delay(ordenarPorData(lista));
}

export async function buscarAvaliacaoPorId(
  id: string
): Promise<AvaliacaoCorporal | null> {
  const avaliacao = avaliacoesEmMemoria.find((a) => a.id === id) ?? null;
  return delay(avaliacao);
}

export async function criarAvaliacao(
  dados: NovaAvaliacao
): Promise<AvaliacaoCorporal> {
  const nova: AvaliacaoCorporal = {
    ...dados,
    id: gerarId("aval"),
    criadoEm: new Date().toISOString(),
  };
  avaliacoesEmMemoria = [nova, ...avaliacoesEmMemoria];
  return delay(nova, 400);
}

/**
 * Retorna a primeira (inicial) e a última (mais recente) avaliação de um
 * animal, usadas nas telas de evolução e comparação.
 */
export async function buscarInicialEAtual(animalId: string): Promise<{
  inicial: AvaliacaoCorporal | null;
  atual: AvaliacaoCorporal | null;
}> {
  const lista = ordenarPorData(
    avaliacoesEmMemoria.filter((a) => a.animalId === animalId)
  );
  if (lista.length === 0) return delay({ inicial: null, atual: null });
  return delay({
    inicial: lista[0],
    atual: lista[lista.length - 1],
  });
}
