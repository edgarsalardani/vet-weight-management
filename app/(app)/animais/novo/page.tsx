"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnimalForm } from "@/components/animals/AnimalForm";
import { criarAnimal } from "@/lib/services/animalService";
import { NovoAnimal } from "@/lib/types";

export default function NovoAnimalPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar(dados: NovoAnimal) {
    setSalvando(true);
    const animal = await criarAnimal(dados);
    setSalvando(false);
    router.push(`/animais/${animal.id}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        titulo="Cadastrar animal"
        subtitulo="Informações básicas do paciente"
        voltarPara="/dashboard"
      />
      <AnimalForm onSalvar={handleSalvar} salvando={salvando} />
    </div>
  );
}
