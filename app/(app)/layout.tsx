"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Spinner } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sessao, carregando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (carregando) return;
    if (!sessao) {
      router.replace("/login");
    } else if (sessao.perfil !== "veterinaria") {
      router.replace("/responsavel");
    }
  }, [carregando, sessao, router]);

  if (carregando || !sessao || sessao.perfil !== "veterinaria") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <AppHeader />
      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto max-w-app px-4 pb-32 pt-6 outline-none sm:px-6 sm:pt-10 md:pb-16"
      >
        <div key={pathname} className="animate-fade-in">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
