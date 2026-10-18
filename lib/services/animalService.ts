import { ANIMAIS_MOCK } from "@/lib/mock-data";
import { Animal, NovoAnimal } from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados dos animais.
 *
 * Por enquanto os dados vivem em um array em memória (mock). Quando a
 * integração com Supabase/PostgreSQL for implementada, basta trocar o
 * corpo de cada função por uma chamada ao client do Supabase — as
 * assinaturas (parâmetros e retorno em Promise) já foram pensadas para
 * isso, então as telas que consomem este serviço não precisarão mudar.
 *
 * Exemplo futuro:
 *   const { data, error } = await supabase.from("animais").select("*");
 */

let animaisEmMemoria: Animal[] = [...ANIMAIS_MOCK];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

export async function listarAnimais(): Promise<Animal[]> {
  const lista = [...animaisEmMemoria].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
  return delay(lista);
}

export async function buscarAnimalPorId(id: string): Promise<Animal | null> {
  const animal = animaisEmMemoria.find((a) => a.id === id) ?? null;
  return delay(animal);
}

export async function criarAnimal(dados: NovoAnimal): Promise<Animal> {
  const novoAnimal: Animal = {
    ...dados,
    id: gerarId("animal"),
    criadoEm: new Date().toISOString(),
  };
  animaisEmMemoria = [novoAnimal, ...animaisEmMemoria];
  return delay(novoAnimal, 400);
}
