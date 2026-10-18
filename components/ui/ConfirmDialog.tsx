"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Janela de confirmação acessível (Esc fecha, foco preso na janela, foco
 * devolvido ao elemento de origem). Usada antes de ações que não têm "desfazer".
 */
export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  confirmarLabel = "Confirmar",
  cancelarLabel = "Cancelar",
  tom = "primary",
  carregando = false,
  onConfirmar,
  onCancelar,
}: {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  confirmarLabel?: string;
  cancelarLabel?: string;
  tom?: "primary" | "danger";
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const painelRef = useRef<HTMLDivElement>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  // Guarda a função mais recente sem reiniciar o efeito (e o foco) a cada renderização.
  const onCancelarRef = useRef(onCancelar);
  onCancelarRef.current = onCancelar;

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelarRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancelarRef.current();
        return;
      }
      if (e.key !== "Tab" || !painelRef.current) return;
      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled])"
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflowAnterior;
      anterior?.focus?.();
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancelar();
      }}
    >
      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        aria-describedby={descricao ? "confirm-descricao" : undefined}
        className="w-full max-w-md animate-pop-in rounded-[24px] bg-white p-6 shadow-elevated"
      >
        <h2 id="confirm-titulo" className="text-lg font-bold text-ink">
          {titulo}
        </h2>
        {descricao && (
          <p id="confirm-descricao" className="mt-2 text-base text-ink-muted">
            {descricao}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelarRef}
            type="button"
            onClick={onCancelar}
            className="inline-flex h-12 items-center justify-center rounded-control border border-line bg-white px-6 text-base font-semibold text-ink transition hover:bg-primary-50 active:scale-[0.98]"
          >
            {cancelarLabel}
          </button>
          <Button
            variant={tom === "danger" ? "danger" : "primary"}
            onClick={onConfirmar}
            carregando={carregando}
          >
            {confirmarLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
