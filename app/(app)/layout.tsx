"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { VetSecondaryNav } from "@/components/layout/VetSecondaryNav";
import { Spinner } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sessao, carregando } = useAuth();
  const router = useRouter();

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
      <AppHeader />
      <VetSecondaryNav />
      <main className="mx-auto max-w-app px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
