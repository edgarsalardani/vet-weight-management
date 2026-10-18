"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/context/ToastContext";
import { RecommendationForm } from "@/components/recommendations/RecommendationForm";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { criarRecomendacao } from "@/lib/services/recommendationService";
import { Animal, NovaRecomendacao } from "@/lib/types";

export default function NovaRecomendacaoPage({
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

  async function handleSalvar(dados: NovaRecomendacao) {
    setSalvando(true);
    await criarRecomendacao(dados);
    setSalvando(false);
    toast({ titulo: "Recomendação salva", descricao: "Ela já aparece para o responsável." });
    router.push(`/animais/${params.id}/recomendacoes`);
  }

  if (carregando) return <PageSkeleton label="Carregando…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        titulo="Nova recomendação"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}/recomendacoes`}
      />
      <RecommendationForm
        animalId={animal.id}
        onSalvar={handleSalvar}
        salvando={salvando}
      />
    </div>
  );
}
