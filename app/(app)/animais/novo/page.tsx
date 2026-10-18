"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/context/ToastContext";
import { AnimalForm } from "@/components/animals/AnimalForm";
import { criarAnimal } from "@/lib/services/animalService";
import { NovoAnimal } from "@/lib/types";

export default function NovoAnimalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar(dados: NovoAnimal) {
    setSalvando(true);
    const animal = await criarAnimal(dados);
    setSalvando(false);
    toast({ titulo: "Animal cadastrado", descricao: `${animal.nome} já está na lista de pacientes.` });
    router.push(`/animais/${animal.id}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        titulo="Cadastrar animal"
        subtitulo="Informações básicas do paciente"
        voltarPara="/dashboard"
      />
      <AnimalForm onSalvar={handleSalvar} salvando={salvando} />
    </div>
  );
}
