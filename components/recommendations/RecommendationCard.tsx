import { Utensils, Activity, Cookie, StickyNote, Droplet, LucideIcon } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Recomendacao } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";

interface Bloco {
  icon: LucideIcon;
  label: string;
  valor?: string;
}

/** Um bloco de orientação — sempre exibido separadamente, nunca como texto corrido. */
function BlocoRecomendacao({ icon: Icon, label, valor }: Bloco) {
  if (!valor) return null;
  return (
    <div className="flex items-start gap-3 rounded-control border border-line bg-surfaceMuted/50 p-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-ink">{valor}</p>
      </div>
    </div>
  );
}

export function RecommendationCard({
  recomendacao,
  vigente = false,
}: {
  recomendacao: Recomendacao;
  vigente?: boolean;
}) {
  const blocos: Bloco[] = [
    { icon: Utensils, label: "Alimento principal", valor: recomendacao.alimentoPrincipal },
    { icon: Cookie, label: "Petisco", valor: recomendacao.petisco },
    { icon: Droplet, label: "Água", valor: recomendacao.agua },
    { icon: Activity, label: "Atividade física", valor: recomendacao.atividadeFisica },
    { icon: StickyNote, label: "Outras orientações", valor: recomendacao.outrasOrientacoes },
  ];

  const algumPreenchido = blocos.some((b) => b.valor);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">
          Registrada em {formatarDataCurta(recomendacao.data)}
        </p>
        {vigente && <Badge tom="ideal">Vigente</Badge>}
      </CardHeader>
      <CardBody>
        {algumPreenchido ? (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {blocos.map((b) => (
              <BlocoRecomendacao key={b.label} {...b} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">Nenhuma orientação registrada.</p>
        )}
      </CardBody>
    </Card>
  );
}
