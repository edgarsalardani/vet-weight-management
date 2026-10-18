"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

export default function RootPage() {
  const { sessao, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    if (!sessao) {
      router.replace("/login");
    } else if (sessao.perfil === "responsavel") {
      router.replace("/responsavel");
    } else {
      router.replace("/dashboard");
    }
  }, [carregando, sessao, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Spinner />
    </div>
  );
}
