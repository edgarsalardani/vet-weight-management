"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssessmentListItem } from "@/components/assessments/AssessmentListItem";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function HistoricoAvaliacoesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, avals] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarAvaliacoesPorAnimal(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      // mais recente primeiro
      setAvaliacoes([...avals].reverse());
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando histórico…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Histórico de avaliações"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}`}
        acao={
          <Button
            size="sm"
            onClick={() => router.push(`/animais/${animal.id}/avaliacoes/nova`)}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nova</span>
          </Button>
        }
      />

      {avaliacoes.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          titulo="Nenhuma avaliação registrada"
          descricao="Registre a primeira avaliação corporal deste paciente."
          acao={
            <Button
              size="sm"
              onClick={() => router.push(`/animais/${animal.id}/avaliacoes/nova`)}
            >
              <Plus className="h-5 w-5" />
              Nova avaliação
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {avaliacoes.map((avaliacao) => (
            <AssessmentListItem key={avaliacao.id} avaliacao={avaliacao} />
          ))}
        </div>
      )}
    </div>
  );
}
