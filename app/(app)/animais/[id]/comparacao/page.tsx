"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { classificarEscore } from "@/lib/constants";
import { cn, formatarDataCurta, formatarPeso } from "@/lib/utils";

const TOM_POR_CATEGORIA = {
  low: "low",
  ideal: "ideal",
  high: "high",
} as const;

interface Coluna {
  rotulo: string;
  avaliacao: AvaliacaoCorporal;
}

interface Metrica {
  label: string;
  unidade?: string;
  valor: (av: AvaliacaoCorporal) => string | number | null | undefined;
}

const METRICAS: Metrica[] = [
  { label: "Peso", unidade: "kg", valor: (av) => av.peso },
  { label: "Massa gorda", unidade: "%", valor: (av) => av.massaGorda },
  { label: "Massa magra", unidade: "%", valor: (av) => av.massaMagra },
  {
    label: "Circunf. torácica",
    unidade: "cm",
    valor: (av) => av.medidas?.circunferenciaToracica,
  },
  {
    label: "Circunf. abdominal",
    unidade: "cm",
    valor: (av) => av.medidas?.circunferenciaAbdominal,
  },
  {
    label: "Comprimento corporal",
    unidade: "cm",
    valor: (av) => av.medidas?.comprimentoCorporal,
  },
  {
    label: "Altura de cernelha",
    unidade: "cm",
    valor: (av) => av.medidas?.alturaCernelha,
  },
];

export default function ComparacaoPage({
  params,
}: {
  params: { id: string };
}) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCorporal[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, avals] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarAvaliacoesPorAnimal(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setAvaliacoes(avals);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  if (carregando) return <PageSkeleton label="Carregando comparação…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length < 2) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          titulo="Comparação"
          subtitulo={animal.nome}
          voltarPara={`/animais/${animal.id}`}
        />
        <EmptyState
          icon={GitCompareArrows}
          titulo="Histórico insuficiente"
          descricao="São necessárias ao menos duas avaliações para comparar a evolução do paciente."
        />
      </div>
    );
  }

  const inicial = avaliacoes[0];
  const atual = avaliacoes[avaliacoes.length - 1];
  const anterior = avaliacoes.length >= 3 ? avaliacoes[avaliacoes.length - 2] : null;

  // Monta as colunas (Inicial / Anterior / Atual), removendo duplicatas
  // quando houver poucas avaliações (ex.: só 2 registros no total).
  const brutas: Coluna[] = [
    { rotulo: "Inicial", avaliacao: inicial },
    ...(anterior ? [{ rotulo: "Anterior", avaliacao: anterior }] : []),
    { rotulo: "Atual", avaliacao: atual },
  ];
  const vistos = new Set<string>();
  const colunas = brutas.filter((c) => {
    if (vistos.has(c.avaliacao.id)) return false;
    vistos.add(c.avaliacao.id);
    return true;
  });

  const linhas = METRICAS.map((m) => ({
    metrica: m,
    valores: colunas.map((c) => m.valor(c.avaliacao)),
  })).filter((l) => l.valores.some((v) => v != null));

  const gridColsClass = colunas.length === 3 ? "grid-cols-3" : "grid-cols-2";
  const modelo = `minmax(7.5rem,1.6fr) repeat(${colunas.length + 1}, minmax(4.5rem,1fr))`;

  function variacao(valores: (string | number | null | undefined)[], unidade?: string) {
    const primeiro = valores[0];
    const ultimo = valores[valores.length - 1];
    if (typeof primeiro !== "number" || typeof ultimo !== "number") return "—";
    const delta = Number((ultimo - primeiro).toFixed(2));
    if (delta === 0) return "sem mudança";
    return `${delta > 0 ? "+" : "−"}${Math.abs(delta)}${unidade ?? ""}`;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titulo="Comparação"
        subtitulo={`${animal.nome} · inicial, anterior e atual`}
        voltarPara={`/animais/${animal.id}`}
      />

      <div className={cn("grid gap-3 sm:gap-5", gridColsClass)}>
        {colunas.map((c) => {
          const faixa = classificarEscore(c.avaliacao.escoreCorporal);
          return (
            <ColunaAvaliacao
              key={c.avaliacao.id}
              rotulo={c.rotulo}
              avaliacao={c.avaliacao}
              tomEscore={TOM_POR_CATEGORIA[faixa.categoria]}
            />
          );
        })}
      </div>

      <Card className="mt-6">
        <CardBody className="pb-3">
          <h2 className="text-base font-bold text-ink">Medidas e composição</h2>
          <div className="-mx-2 mt-3 overflow-x-auto px-2">
            <div className="min-w-[30rem]">
              <div
                className="grid gap-2 px-3 pb-2 text-xs font-bold uppercase tracking-wide text-ink-faint"
                style={{ gridTemplateColumns: modelo }}
              >
                <span>Métrica</span>
                {colunas.map((c) => (
                  <span key={c.avaliacao.id} className="text-center">
                    {c.rotulo}
                  </span>
                ))}
                <span className="text-center">Variação</span>
              </div>
              <div className="space-y-1">
                {linhas.map(({ metrica, valores }, idx) => (
                  <div
                    key={metrica.label}
                    className={cn(
                      "grid items-center gap-2 rounded-2xl px-3 py-3 text-sm",
                      idx % 2 === 0 ? "bg-surfaceMuted/70" : "bg-transparent"
                    )}
                    style={{ gridTemplateColumns: modelo }}
                  >
                    <span className="font-medium text-ink-muted">{metrica.label}</span>
                    {valores.map((v, i) => (
                      <span
                        key={i}
                        className={cn(
                          "numeric text-center text-ink",
                          i === valores.length - 1 && "font-bold"
                        )}
                      >
                        {v != null ? `${v}${metrica.unidade ?? ""}` : "—"}
                      </span>
                    ))}
                    <span className="numeric text-center font-bold text-primary">
                      {variacao(valores, metrica.unidade)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {colunas.some((c) => c.avaliacao.observacoes) && (
        <div className={cn("mt-6 grid gap-4 max-sm:grid-cols-1", gridColsClass)}>
          {colunas.map((c) => (
            <Card key={c.avaliacao.id}>
              <CardBody>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                  Observações · {c.rotulo} · {formatarDataCurta(c.avaliacao.data)}
                </p>
                <p className="mt-2 text-base text-ink">
                  {c.avaliacao.observacoes || "Sem observações registradas."}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ColunaAvaliacao({
  rotulo,
  avaliacao,
  tomEscore,
}: {
  rotulo: string;
  avaliacao: AvaliacaoCorporal;
  tomEscore: "low" | "ideal" | "high";
}) {
  return (
    <Card>
      <CardBody className="flex flex-col items-center gap-2 px-3 py-4 text-center sm:px-4">
        <span className="rounded-full bg-primary-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          {rotulo}
        </span>
        {avaliacao.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avaliacao.fotoUrl}
            alt={`Foto da avaliação ${rotulo.toLowerCase()}`}
            className="h-20 w-20 rounded-control border border-line object-cover"
          />
        ) : (
          <BodySilhouette escore={avaliacao.escoreCorporal} tamanho="md" />
        )}
        <p className="numeric text-lg font-bold text-ink">{formatarPeso(avaliacao.peso)}</p>
        <Badge tom={tomEscore}>ECC {avaliacao.escoreCorporal}</Badge>
        <p className="text-sm text-ink-muted">{formatarDataCurta(avaliacao.data)}</p>
      </CardBody>
    </Card>
  );
}
