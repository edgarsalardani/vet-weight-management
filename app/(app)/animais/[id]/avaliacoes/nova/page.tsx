"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/context/ToastContext";
import { AssessmentForm } from "@/components/assessments/AssessmentForm";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { criarAvaliacao } from "@/lib/services/assessmentService";
import { Animal, NovaAvaliacao } from "@/lib/types";

export default function NovaAvaliacaoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    buscarAnimalPorId(params.id).then((a) => {
      if (!ativo) return;
      setAnimal(a);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [params.id]);

  async function handleSalvar(dados: NovaAvaliacao) {
    setSalvando(true);
    await criarAvaliacao(dados);
    setSalvando(false);
    toast({ titulo: "Avaliação salva", descricao: "O histórico do paciente foi atualizado." });
    router.push(`/animais/${params.id}/avaliacoes`);
  }

  if (carregando) return <PageSkeleton label="Carregando…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        titulo="Nova avaliação"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}`}
      />
      <AssessmentForm
        animalId={animal.id}
        onSalvar={handleSalvar}
        salvando={salvando}
      />
    </div>
  );
}
