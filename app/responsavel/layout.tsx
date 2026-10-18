"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { Spinner } from "@/components/ui/Spinner";

export default function ResponsavelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessao, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    if (!sessao) {
      router.replace("/login");
    } else if (sessao.perfil !== "responsavel") {
      router.replace("/dashboard");
    }
  }, [carregando, sessao, router]);

  if (carregando || !sessao || sessao.perfil !== "responsavel") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader />
      <main className="mx-auto max-w-app px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
