"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  confirmarPresenca,
  solicitarRemarcacao,
} from "@/lib/services/appointmentService";
import { Compromisso, StatusConfirmacao } from "@/lib/types";
import { STATUS_CONFIRMACAO_LABELS, STATUS_CONFIRMACAO_TOM } from "@/lib/constants";
import { formatarDataCurta, formatarDiaSemana } from "@/lib/utils";

export function NextAppointmentCard({
  compromisso,
  nomeAnimal,
  onAtualizado,
}: {
  compromisso: Compromisso;
  nomeAnimal: string;
  onAtualizado?: (compromisso: Compromisso) => void;
}) {
  const { toast } = useToast();
  const [statusAtual, setStatusAtual] = useState<StatusConfirmacao>(
    compromisso.statusConfirmacao ?? "aguardando"
  );
  const [carregando, setCarregando] = useState<"confirmar" | "remarcar" | null>(null);
  const [confirmandoRemarcacao, setConfirmandoRemarcacao] = useState(false);

  const dia = compromisso.data.slice(8, 10);
  const mesAbreviado = formatarDataCurta(compromisso.data).split(" ")[1];

  async function handleConfirmar() {
    setCarregando("confirmar");
    const atualizado = await confirmarPresenca(compromisso.id);
    setCarregando(null);
    if (atualizado) {
      setStatusAtual(atualizado.statusConfirmacao ?? "confirmado");
      onAtualizado?.(atualizado);
      toast({
        titulo: "Presença confirmada",
        descricao: `Sua presença no retorno de ${nomeAnimal} foi registrada.`,
      });
    }
  }

  async function handleRemarcar() {
    setCarregando("remarcar");
    const atualizado = await solicitarRemarcacao(compromisso.id);
    setCarregando(null);
    setConfirmandoRemarcacao(false);
    if (atualizado) {
      setStatusAtual(atualizado.statusConfirmacao ?? "remarcacao_solicitada");
      onAtualizado?.(atualizado);
      toast({
        titulo: "Solicitação de remarcação registrada",
        descricao: "A médica-veterinária foi avisada.",
      });
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardBody className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Próximo retorno
            </p>
            <Badge tom={STATUS_CONFIRMACAO_TOM[statusAtual]}>
              {STATUS_CONFIRMACAO_LABELS[statusAtual]}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-white shadow-soft"
            >
              <span className="numeric text-3xl font-bold leading-none">{dia}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-90">
                {mesAbreviado}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-ink">{nomeAnimal}</p>
              <p className="text-base text-ink-muted">
                {formatarDiaSemana(compromisso.data)}, {formatarDataCurta(compromisso.data)}
              </p>
              {compromisso.horario && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-ink">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="numeric">{compromisso.horario}</span>
                </p>
              )}
            </div>
          </div>

          {compromisso.orientacaoRetorno && (
            <div className="rounded-2xl bg-primary-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                Orientação para o retorno
              </p>
              <p className="mt-1 text-base text-ink">{compromisso.orientacaoRetorno}</p>
            </div>
          )}

          {statusAtual === "aguardando" && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleConfirmar}
                carregando={carregando === "confirmar"}
                disabled={carregando !== null}
                className="sm:flex-1"
              >
                <Check className="h-5 w-5" />
                Confirmar presença
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmandoRemarcacao(true)}
                disabled={carregando !== null}
                className="sm:flex-1"
              >
                <RotateCcw className="h-5 w-5" />
                Remarcar
              </Button>
            </div>
          )}

          {statusAtual === "confirmado" && (
            <p className="flex items-center gap-2 text-base font-medium text-status-ideal">
              <CheckCircle2 className="h-5 w-5" />
              Tudo certo! Esperamos vocês no dia.
            </p>
          )}

          {statusAtual === "remarcacao_solicitada" && (
            <p className="text-base text-ink-muted">
              A médica-veterinária foi avisada e entrará em contato para definir
              uma nova data.
            </p>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        aberto={confirmandoRemarcacao}
        titulo="Solicitar remarcação?"
        descricao="A médica-veterinária será avisada e entrará em contato para combinar uma nova data. Você não precisa escolher o horário agora."
        confirmarLabel="Solicitar remarcação"
        carregando={carregando === "remarcar"}
        onConfirmar={handleRemarcar}
        onCancelar={() => setConfirmandoRemarcacao(false)}
      />
    </>
  );
}
