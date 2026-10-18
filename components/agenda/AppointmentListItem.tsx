import Link from "next/link";
import { Stethoscope, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Compromisso } from "@/lib/types";
import { STATUS_COMPROMISSO_LABELS, TIPO_COMPROMISSO_LABELS } from "@/lib/constants";
import { formatarDataCurta, formatarDiaSemana } from "@/lib/utils";

const TOM_STATUS = {
  agendado: "low",
  concluido: "ideal",
  cancelado: "neutral",
} as const;

export function AppointmentListItem({
  compromisso,
  nomeAnimal,
  href,
}: {
  compromisso: Compromisso;
  nomeAnimal: string;
  href: string;
}) {
  const Icon = compromisso.tipo === "atividade_pesquisa" ? FlaskConical : Stethoscope;

  return (
    <Link
      href={href}
      className="flex items-start gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:border-primary/40"
    >
      <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-control bg-primary-light text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-ink">{nomeAnimal}</p>
          <Badge tom={TOM_STATUS[compromisso.status]}>
            {STATUS_COMPROMISSO_LABELS[compromisso.status]}
          </Badge>
        </div>
        <p className="text-sm text-ink-muted">{compromisso.titulo}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
          <span className="numeric font-medium text-ink-muted">
            {formatarDiaSemana(compromisso.data)}, {formatarDataCurta(compromisso.data)}
            {compromisso.horario ? ` às ${compromisso.horario}` : ""}
          </span>
          <span className="rounded-full bg-surfaceMuted px-2 py-0.5 font-medium uppercase tracking-wide">
            {TIPO_COMPROMISSO_LABELS[compromisso.tipo]}
          </span>
        </div>
        {compromisso.orientacaoRetorno && (
          <p className="mt-2 text-sm text-ink-muted">
            <span className="font-medium text-ink">Orientação para o retorno:</span>{" "}
            {compromisso.orientacaoRetorno}
          </p>
        )}
      </div>
    </Link>
  );
}
