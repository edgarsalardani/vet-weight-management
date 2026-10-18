"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint, Stethoscope, Heart, ChevronRight, LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IconTile } from "@/components/ui/IconTile";
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 via-bg to-bg px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary text-white shadow-elevated">
            <PawPrint className="h-10 w-10" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Bem-vindo ao VetCheck</h1>
          <p className="mt-2 max-w-xs text-base text-ink-muted">
            Acompanhe a evolução corporal de cães de forma simples e organizada.
          </p>
        </div>

        <p className="mb-3 text-center text-sm font-semibold text-ink-muted">
          Como você quer entrar?
        </p>
        <div className="space-y-4">
          <PerfilCard
            icon={Stethoscope}
            titulo="Entrar como Veterinária"
            descricao="Cadastre pacientes, registre avaliações e acompanhe a evolução."
            carregando={entrandoComo === "veterinaria"}
            desabilitado={entrandoComo !== null}
            onClick={() => handleEntrar("veterinaria")}
          />
          <PerfilCard
            icon={Heart}
            titulo="Entrar como Responsável"
            descricao="Acompanhe o seu animal, os retornos e as orientações."
            carregando={entrandoComo === "responsavel"}
            desabilitado={entrandoComo !== null}
            onClick={() => handleEntrar("responsavel")}
          />
        </div>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Protótipo de demonstração: escolha um perfil para explorar a aplicação.
        </p>
      </div>
    </main>
  );
}

function PerfilCard({
  icon,
  titulo,
  descricao,
  carregando,
  desabilitado,
  onClick,
}: {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  carregando: boolean;
  desabilitado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-busy={carregando || undefined}
      className="group flex w-full items-center gap-4 rounded-card border border-line/70 bg-white p-5 text-left shadow-card transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-elevated active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <IconTile icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-ink">{titulo}</span>
        <span className="mt-0.5 block text-sm text-ink-muted">{descricao}</span>
      </span>
      {carregando ? (
        <span
          aria-hidden
          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
        />
      ) : (
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
