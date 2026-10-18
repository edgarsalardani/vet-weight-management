"use client";

import Link from "next/link";
import { PawPrint, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { gerarIniciais } from "@/lib/utils";

export function AppHeader() {
  const { sessao, logout } = useAuth();

  const rotaInicial = sessao?.perfil === "responsavel" ? "/responsavel" : "/dashboard";

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-app items-center justify-between px-4 sm:px-6">
        <Link href={rotaInicial} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-control bg-primary text-white">
            <PawPrint className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold text-ink">VetCheck</span>
        </Link>

        {sessao && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-ink">
                {sessao.nome}
              </p>
              <p className="text-xs leading-tight text-ink-muted">
                {sessao.perfil === "veterinaria"
                  ? sessao.crmv ?? "Médica-veterinária"
                  : "Responsável"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
              {gerarIniciais(sessao.nome)}
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sair"
              title="Sair"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:bg-surfaceMuted"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
