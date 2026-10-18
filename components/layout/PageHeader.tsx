"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function PageHeader({
  titulo,
  subtitulo,
  voltarPara,
  acao,
}: {
  titulo: string;
  subtitulo?: string;
  voltarPara?: string;
  acao?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        {voltarPara && (
          <button
            type="button"
            onClick={() => router.push(voltarPara)}
            aria-label="Voltar"
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition duration-150 hover:bg-primary-50 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="mt-1 text-base text-ink-muted">{subtitulo}</p>
          )}
        </div>
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  );
}
