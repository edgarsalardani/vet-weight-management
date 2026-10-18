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
    <div className="mb-6 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {voltarPara && (
          <button
            type="button"
            onClick={() => router.push(voltarPara)}
            aria-label="Voltar"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-muted transition-colors hover:bg-surfaceMuted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="mt-0.5 text-sm text-ink-muted">{subtitulo}</p>
          )}
        </div>
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  );
}
