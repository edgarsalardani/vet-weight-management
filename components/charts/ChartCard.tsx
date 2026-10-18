import { ReactNode } from "react";
import { Card, CardBody } from "@/components/ui/Card";

/** Cartão padrão para gráficos: título claro e área de gráfico com respiro. */
export function ChartCard({
  titulo,
  descricao,
  children,
  className,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardBody className="pb-3 sm:pb-4">
        <h3 className="text-base font-bold text-ink">{titulo}</h3>
        {descricao && <p className="mt-0.5 text-sm text-ink-muted">{descricao}</p>}
        <div className="mt-4">{children}</div>
      </CardBody>
    </Card>
  );
}
