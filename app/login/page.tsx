"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint, Stethoscope, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Perfil } from "@/lib/types";

const ROTA_POR_PERFIL: Record<Perfil, string> = {
  veterinaria: "/dashboard",
  responsavel: "/responsavel",
};

export default function LoginPage() {
  const { sessao, carregando, login } = useAuth();
  const router = useRouter();
  const [entrandoComo, setEntrandoComo] = useState<Perfil | null>(null);

  useEffect(() => {
    if (!carregando && sessao) {
      router.replace(ROTA_POR_PERFIL[sessao.perfil]);
    }
  }, [carregando, sessao, router]);

  async function handleEntrar(perfil: Perfil) {
    setEntrandoComo(perfil);
    await login(perfil);
    router.replace(ROTA_POR_PERFIL[perfil]);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-control bg-primary text-white">
            <PawPrint className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-semibold text-ink">VetCheck</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Acompanhamento da condição corporal de cães
          </p>
        </div>

        <div className="space-y-3">
          <PerfilCard
            icon={Stethoscope}
            titulo="Entrar como Veterinária"
            descricao="Cadastra pacientes, registra avaliações e acompanha a evolução."
            carregando={entrandoComo === "veterinaria"}
            onClick={() => handleEntrar("veterinaria")}
          />
          <PerfilCard
            icon={Heart}
            titulo="Entrar como Responsável"
            descricao="Acompanha a evolução do próprio pet, sem editar dados clínicos."
            carregando={entrandoComo === "responsavel"}
            onClick={() => handleEntrar("responsavel")}
          />
        </div>

        <p className="mt-5 text-center text-xs text-ink-faint">
          Protótipo de demonstração — escolha um perfil para explorar a
          aplicação. Não há autenticação real.
        </p>
      </div>
    </div>
  );
}

function PerfilCard({
  icon: Icon,
  titulo,
  descricao,
  carregando,
  onClick,
}: {
  icon: typeof Stethoscope;
  titulo: string;
  descricao: string;
  carregando: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={carregando}
      className="flex w-full items-start gap-3.5 rounded-card border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-primary/50 disabled:opacity-60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{titulo}</span>
        <span className="mt-0.5 block text-sm text-ink-muted">
          {descricao}
        </span>
      </span>
      {carregando && (
        <span className="mt-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </button>
  );
}
