import { Utensils, Activity, Cookie, StickyNote, Droplet, LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/IconTile";
import { Recomendacao } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";

interface Bloco {
  icon: LucideIcon;
  label: string;
  valor?: string;
}

/** Um bloco de orientação — sempre exibido separadamente, nunca como texto corrido. */
function BlocoRecomendacao({ icon, label, valor }: Bloco) {
  if (!valor) return null;
  return (
    <div className="flex items-start gap-3.5 rounded-2xl bg-surfaceMuted/70 p-4">
      <IconTile icon={icon} tamanho="sm" className="bg-white shadow-soft" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="mt-0.5 text-base text-ink-muted">{valor}</p>
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
      <CardBody>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            Registrada em{" "}
            <span className="font-semibold text-ink">{formatarDataCurta(recomendacao.data)}</span>
          </p>
          {vigente && <Badge tom="ideal">Vigente</Badge>}
        </div>
        {algumPreenchido ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {blocos.map((b) => (
              <BlocoRecomendacao key={b.label} {...b} />
            ))}
          </div>
        ) : (
          <p className="text-base text-ink-muted">Nenhuma orientação registrada.</p>
        )}
      </CardBody>
    </Card>
  );
}
