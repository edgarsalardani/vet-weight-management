"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { BodySilhouette } from "@/components/assessments/BodySilhouette";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import { listarAvaliacoesPorAnimal } from "@/lib/services/assessmentService";
import { Animal, AvaliacaoCorporal } from "@/lib/types";
import { classificarEscore } from "@/lib/constants";
import { cn, formatarDataCurta } from "@/lib/utils";

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

  if (carregando) return <Spinner label="Carregando comparação…" />;
  if (!animal) return <p className="text-ink-muted">Animal não encontrado.</p>;

  if (avaliacoes.length < 2) {
    return (
      <div className="mx-auto max-w-2xl">
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

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Comparação"
        subtitulo={`${animal.nome} · avaliação inicial, anterior e atual, quando disponíveis`}
        voltarPara={`/animais/${animal.id}`}
      />

      <div className={cn("grid gap-3", gridColsClass)}>
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

      <Card className="mt-4">
        <CardHeader>
          <p className="text-sm font-medium text-ink">Medidas e composição</p>
        </CardHeader>
        <CardBody className="divide-y divide-line p-0">
          <div
            className="grid px-5 py-2.5 text-xs font-medium text-ink-faint"
            style={{ gridTemplateColumns: `1.4fr repeat(${colunas.length}, 1fr)` }}
          >
            <span>Métrica</span>
            {colunas.map((c) => (
              <span key={c.avaliacao.id} className="text-center">
                {c.rotulo}
              </span>
            ))}
          </div>
          {linhas.map(({ metrica, valores }) => (
            <div
              key={metrica.label}
              className="grid items-center px-5 py-3 text-sm"
              style={{ gridTemplateColumns: `1.4fr repeat(${colunas.length}, 1fr)` }}
            >
              <span className="text-ink-muted">{metrica.label}</span>
              {valores.map((v, i) => (
                <span
                  key={i}
                  className={cn(
                    "numeric text-center text-ink",
                    i === valores.length - 1 && "font-medium"
                  )}
                >
                  {v != null ? `${v}${metrica.unidade ?? ""}` : "—"}
                </span>
              ))}
            </div>
          ))}
        </CardBody>
      </Card>

      {colunas.some((c) => c.avaliacao.observacoes) && (
        <div className={cn("mt-4 grid gap-3", gridColsClass)}>
          {colunas.map((c) => (
            <Card key={c.avaliacao.id}>
              <CardHeader>
                <p className="text-xs font-medium text-ink-faint">
                  Observações · {formatarDataCurta(c.avaliacao.data)}
                </p>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-ink">
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
      <CardBody className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {rotulo}
        </p>
        {avaliacao.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avaliacao.fotoUrl}
            alt={`Foto da avaliação ${rotulo.toLowerCase()}`}
            className="h-16 w-16 rounded-control border border-line object-cover"
          />
        ) : (
          <BodySilhouette escore={avaliacao.escoreCorporal} tamanho="sm" />
        )}
        <p className="text-xs text-ink">{formatarDataCurta(avaliacao.data)}</p>
        <Badge tom={tomEscore}>ECC {avaliacao.escoreCorporal}</Badge>
      </CardBody>
    </Card>
  );
}
