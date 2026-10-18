"use client";

import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResearchProjectCard } from "@/components/research/ResearchProjectCard";
import { contarParticipantes, listarProjetos } from "@/lib/services/researchService";
import { ProjetoPesquisa } from "@/lib/types";

export default function PesquisaPage() {
  const [projetos, setProjetos] = useState<ProjetoPesquisa[]>([]);
  const [participantesPorProjeto, setParticipantesPorProjeto] = useState<
    Record<string, number>
  >({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const lista = await listarProjetos();
      if (!ativo) return;
      setProjetos(lista);

      const contagens = await Promise.all(
        lista.map(async (p) => [p.id, await contarParticipantes(p.id)] as const)
      );
      if (!ativo) return;
      setParticipantesPorProjeto(Object.fromEntries(contagens));
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) return <PageSkeleton label="Carregando projetos…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Projetos de Pesquisa"
        subtitulo="Independente do acompanhamento corporal — compartilha apenas o cadastro de pacientes"
      />

      {projetos.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          titulo="Nenhum projeto cadastrado"
          descricao="Os projetos de pesquisa aparecerão aqui."
        />
      ) : (
        <div className="space-y-4">
          {projetos.map((projeto) => (
            <ResearchProjectCard
              key={projeto.id}
              projeto={projeto}
              quantidadeParticipantes={participantesPorProjeto[projeto.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
