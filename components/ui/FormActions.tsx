"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

/**
 * Barra de ações de formulário: Cancelar + Salvar. Se houver alterações
 * não salvas, o cancelamento pede confirmação antes de descartar.
 */
export function FormActions({
  salvarLabel,
  salvando = false,
  alterado = false,
}: {
  salvarLabel: string;
  salvando?: boolean;
  alterado?: boolean;
}) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);

  return (
    <>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={salvando}
          onClick={() => (alterado ? setConfirmando(true) : router.back())}
        >
          Cancelar
        </Button>
        <Button type="submit" carregando={salvando}>
          {salvarLabel}
        </Button>
      </div>
      <ConfirmDialog
        aberto={confirmando}
        titulo="Descartar alterações?"
        descricao="Você preencheu informações que ainda não foram salvas. Se sair agora, elas serão perdidas."
        confirmarLabel="Descartar"
        cancelarLabel="Continuar editando"
        tom="danger"
        onConfirmar={() => {
          setConfirmando(false);
          router.back();
        }}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  );
}
