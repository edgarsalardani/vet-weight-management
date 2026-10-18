"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listarAnimais } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { AnimalCard } from "@/components/animals/AnimalCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  const { sessao } = useAuth();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [ultimasAvaliacoes, setUltimasAvaliacoes] = useState<
    Record<string, AvaliacaoCorporal | null>
  >({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      const lista = await listarAnimais();
      if (!ativo) return;
      setAnimais(lista);

      const entradas = await Promise.all(
        lista.map(async (animal) => {
          const avaliacoes = await listarAvaliacoesPorAnimal(animal.id);
          return [animal.id, avaliacoes[avaliacoes.length - 1] ?? null] as const;
        })
      );
      if (!ativo) return;
      setUltimasAvaliacoes(Object.fromEntries(entradas));
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const primeiroNome = sessao?.nome.split(" ").slice(0, 2).join(" ");

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Olá, {primeiroNome}
          </h1>
          <p className="mt-1 text-base text-ink-muted">
            {carregando
              ? "Carregando pacientes…"
              : `${animais.length} ${
                  animais.length === 1 ? "paciente cadastrado" : "pacientes cadastrados"
                }`}
          </p>
        </div>
        <Link href="/animais/novo" className="shrink-0 rounded-control">
          <Button size="sm">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Novo animal</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </Link>
      </div>

      {carregando ? (
        <div
          role="status"
          aria-live="polite"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Carregando pacientes…</span>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))}
        </div>
      ) : animais.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          titulo="Nenhum animal cadastrado"
          descricao="Cadastre o primeiro paciente para começar a acompanhar a condição corporal."
          acao={
            <Link href="/animais/novo" className="rounded-control">
              <Button>
                <Plus className="h-5 w-5" />
                Cadastrar animal
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {animais.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              ultimaAvaliacao={ultimasAvaliacoes[animal.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
