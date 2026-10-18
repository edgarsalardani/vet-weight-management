"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarRecomendacoesPorAnimal } from "@/lib/services/recommendationService";
import { Animal, Recomendacao } from "@/lib/types";

export default function RecomendacoesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, lista] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarRecomendacoesPorAnimal(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setRecomendacoes([...lista].reverse());
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando recomendações…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  const [atual, ...anteriores] = recomendacoes;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Recomendações"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}`}
        acao={
          <Button
            size="sm"
            onClick={() => router.push(`/animais/${animal.id}/recomendacoes/nova`)}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nova</span>
          </Button>
        }
      />

      {!atual ? (
        <EmptyState
          icon={ClipboardList}
          titulo="Nenhuma recomendação registrada"
          descricao="Registre o plano alimentar e de manejo para este paciente."
          acao={
            <Button
              size="sm"
              onClick={() => router.push(`/animais/${animal.id}/recomendacoes/nova`)}
            >
              <Plus className="h-5 w-5" />
              Nova recomendação
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <RecommendationCard recomendacao={atual} vigente />

          {anteriores.length > 0 && (
            <>
              <h2 className="pt-2 text-sm font-medium text-ink-muted">
                Recomendações anteriores
              </h2>
              {anteriores.map((r) => (
                <RecommendationCard key={r.id} recomendacao={r} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
