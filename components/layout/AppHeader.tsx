"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn, gerarIniciais } from "@/lib/utils";
import { NAV_VETERINARIA, itemAtivo } from "@/components/layout/vetNav";

export function AppHeader() {
  const { sessao, logout } = useAuth();
  const pathname = usePathname();

  const rotaInicial = sessao?.perfil === "responsavel" ? "/responsavel" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-app items-center gap-4 px-4 sm:px-6">
        <Link href={rotaInicial} className="flex items-center gap-2.5 rounded-control">
          <span className="flex h-10 w-10 items-center justify-center rounded-control bg-primary text-white shadow-soft">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">VetCheck</span>
        </Link>

        {sessao?.perfil === "veterinaria" && (
          <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
            {NAV_VETERINARIA.map((item) => {
              const ativo = itemAtivo(item, pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={ativo ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-150",
                    ativo
                      ? "bg-primary-50 text-primary"
                      : "text-ink-muted hover:bg-surfaceMuted hover:text-ink"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {sessao && (
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-ink">
                {sessao.nome}
              </p>
              <p className="text-xs leading-tight text-ink-muted">
                {sessao.perfil === "veterinaria"
                  ? sessao.crmv ?? "Médica-veterinária"
                  : "Responsável"}
              </p>
            </div>
            <div
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary"
            >
              {gerarIniciais(sessao.nome)}
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sair"
              title="Sair"
              className="flex h-11 items-center gap-2 rounded-full border border-line bg-white px-3 text-sm font-semibold text-ink-muted shadow-soft transition duration-150 hover:bg-primary-50 hover:text-ink active:scale-95 md:px-4"
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
