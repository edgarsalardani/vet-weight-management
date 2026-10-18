import Link from "next/link";
import { ChevronRight, Stethoscope, FlaskConical, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/IconTile";
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
  const pesquisa = compromisso.tipo === "atividade_pesquisa";

  return (
    <Link href={href} className="group block rounded-card">
      <div className="flex items-start gap-4 rounded-card border border-line/70 bg-surface p-4 shadow-card transition duration-150 group-hover:-translate-y-0.5 group-hover:shadow-elevated sm:p-5">
        <IconTile icon={pesquisa ? FlaskConical : Stethoscope} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-bold text-ink">{nomeAnimal}</p>
            <Badge tom={TOM_STATUS[compromisso.status]}>
              {STATUS_COMPROMISSO_LABELS[compromisso.status]}
            </Badge>
          </div>
          <p className="mt-0.5 text-base text-ink-muted">{compromisso.titulo}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Clock className="h-4 w-4 text-primary" />
              <span className="numeric">
                {formatarDiaSemana(compromisso.data)}, {formatarDataCurta(compromisso.data)}
                {compromisso.horario ? ` às ${compromisso.horario}` : ""}
              </span>
            </span>
            <Badge tom="neutral">{TIPO_COMPROMISSO_LABELS[compromisso.tipo]}</Badge>
          </div>
          {compromisso.orientacaoRetorno && (
            <p className="mt-3 rounded-2xl bg-primary-50 px-4 py-3 text-base text-ink">
              <span className="font-bold">Orientação para o retorno:</span>{" "}
              {compromisso.orientacaoRetorno}
            </p>
          )}
        </div>
        <ChevronRight className="mt-1 hidden h-5 w-5 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 sm:block" />
      </div>
    </Link>
  );
}
