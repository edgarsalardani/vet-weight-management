import { DOCUMENTOS_MOCK } from "@/lib/mock-data";
import { Documento, NovoDocumento } from "@/lib/types";
import { gerarId } from "@/lib/utils";

/**
 * Camada de acesso a dados de documentos e exames.
 * Ver comentário em animalService.ts sobre a futura troca por Supabase.
 * Tabela futura: `documents` (FK animal_id -> patients.id,
 * assessment_id -> assessments.id quando associado a um retorno).
 *
 * Nesta etapa o "arquivo" enviado pela interface é apenas simulado
 * (guardado como data URL em memória) — quando o Supabase Storage for
 * integrado, `criarDocumento` passará a fazer upload real e salvar a
 * URL pública retornada.
 */

let documentosEmMemoria: Documento[] = [...DOCUMENTOS_MOCK];

function delay<T>(dados: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), ms));
}

export async function listarDocumentosPorAnimal(
  animalId: string
): Promise<Documento[]> {
  const lista = documentosEmMemoria
    .filter((d) => d.animalId === animalId)
    .sort((a, b) => b.data.localeCompare(a.data));
  return delay(lista);
}

export async function criarDocumento(dados: NovoDocumento): Promise<Documento> {
  const novo: Documento = {
    ...dados,
    id: gerarId("doc"),
    criadoEm: new Date().toISOString(),
  };
  documentosEmMemoria = [novo, ...documentosEmMemoria];
  return delay(novo, 400);
}
