"use client";

import { useState } from "react";
import { CalendarClock, Check, RotateCcw } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const [statusAtual, setStatusAtual] = useState<StatusConfirmacao>(
    compromisso.statusConfirmacao ?? "aguardando"
  );
  const [carregando, setCarregando] = useState<"confirmar" | "remarcar" | null>(null);

  async function handleConfirmar() {
    setCarregando("confirmar");
    const atualizado = await confirmarPresenca(compromisso.id);
    setCarregando(null);
    if (atualizado) {
      setStatusAtual(atualizado.statusConfirmacao ?? "confirmado");
      onAtualizado?.(atualizado);
    }
  }

  async function handleRemarcar() {
    setCarregando("remarcar");
    const atualizado = await solicitarRemarcacao(compromisso.id);
    setCarregando(null);
    if (atualizado) {
      setStatusAtual(atualizado.statusConfirmacao ?? "remarcacao_solicitada");
      onAtualizado?.(atualizado);
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-ink">Próximo retorno</p>
        </div>
        <Badge tom={STATUS_CONFIRMACAO_TOM[statusAtual]}>
          {STATUS_CONFIRMACAO_LABELS[statusAtual]}
        </Badge>
      </CardHeader>
      <CardBody className="space-y-3">
        <div>
          <p className="font-medium text-ink">{nomeAnimal}</p>
          <p className="numeric text-sm text-ink-muted">
            {formatarDiaSemana(compromisso.data)}, {formatarDataCurta(compromisso.data)}
            {compromisso.horario ? ` às ${compromisso.horario}` : ""}
          </p>
        </div>

        {compromisso.orientacaoRetorno && (
          <div className="rounded-control border border-line bg-surfaceMuted/60 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Orientação para o retorno
            </p>
            <p className="mt-0.5 text-sm text-ink">{compromisso.orientacaoRetorno}</p>
          </div>
        )}

        {statusAtual === "aguardando" && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleConfirmar}
              carregando={carregando === "confirmar"}
              disabled={carregando !== null}
            >
              <Check className="h-4 w-4" />
              Confirmar presença
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRemarcar}
              carregando={carregando === "remarcar"}
              disabled={carregando !== null}
            >
              <RotateCcw className="h-4 w-4" />
              Remarcar
            </Button>
          </div>
        )}

        {statusAtual === "remarcacao_solicitada" && (
          <p className="text-xs text-ink-muted">
            A médica-veterinária foi avisada e entrará em contato para definir
            uma nova data.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
