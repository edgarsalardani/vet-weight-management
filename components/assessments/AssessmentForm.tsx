"use client";

import { FormEvent, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BodyScoreScale } from "@/components/assessments/BodyScoreScale";
import { NovaAvaliacao } from "@/lib/types";

interface Props {
  animalId: string;
  onSalvar: (dados: NovaAvaliacao) => Promise<void>;
  salvando?: boolean;
}

const hoje = new Date().toISOString().slice(0, 10);

const valoresIniciais = {
  data: hoje,
  peso: "",
  escoreCorporal: 5,
  massaGorda: "",
  massaMagra: "",
  circunferenciaToracica: "",
  circunferenciaAbdominal: "",
  comprimentoCorporal: "",
  alturaCernelha: "",
  observacoes: "",
  fotoUrl: null as string | null,
};

export function AssessmentForm({ animalId, onSalvar, salvando = false }: Props) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState<Record<string, string>>({});
  const inputFotoRef = useRef<HTMLInputElement>(null);

  function campo<K extends keyof typeof valoresIniciais>(
    chave: K,
    valor: (typeof valoresIniciais)[K]
  ) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => campo("fotoUrl", leitor.result as string);
    leitor.readAsDataURL(arquivo);
  }

  function validar(): boolean {
    const novosErros: Record<string, string> = {};
    if (!valores.data) novosErros.data = "Informe a data da avaliação.";
    if (!valores.peso || Number(valores.peso) <= 0)
      novosErros.peso = "Informe um peso válido.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    await onSalvar({
      animalId,
      data: valores.data,
      peso: Number(valores.peso),
      escoreCorporal: valores.escoreCorporal,
      massaGorda: valores.massaGorda ? Number(valores.massaGorda) : null,
      massaMagra: valores.massaMagra ? Number(valores.massaMagra) : null,
      medidas: {
        circunferenciaToracica: valores.circunferenciaToracica
          ? Number(valores.circunferenciaToracica)
          : undefined,
        circunferenciaAbdominal: valores.circunferenciaAbdominal
          ? Number(valores.circunferenciaAbdominal)
          : undefined,
        comprimentoCorporal: valores.comprimentoCorporal
          ? Number(valores.comprimentoCorporal)
          : undefined,
        alturaCernelha: valores.alturaCernelha
          ? Number(valores.alturaCernelha)
          : undefined,
      },
      fotoUrl: valores.fotoUrl,
      observacoes: valores.observacoes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Data da avaliação" htmlFor="data" required erro={erros.data}>
          <Input
            id="data"
            type="date"
            value={valores.data}
            max={hoje}
            onChange={(e) => campo("data", e.target.value)}
            erro={Boolean(erros.data)}
          />
        </FieldWrapper>

        <FieldWrapper label="Peso (kg)" htmlFor="peso" required erro={erros.peso}>
          <Input
            id="peso"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="Ex.: 18.5"
            value={valores.peso}
            onChange={(e) => campo("peso", e.target.value)}
            erro={Boolean(erros.peso)}
          />
        </FieldWrapper>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-ink">
            Escore de Condição Corporal (ECC)
          </p>
        </CardHeader>
        <CardBody>
          <BodyScoreScale
            value={valores.escoreCorporal}
            onChange={(v) => campo("escoreCorporal", v)}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Massa gorda (%)" htmlFor="massaGorda">
          <Input
            id="massaGorda"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            max="100"
            placeholder="Ex.: 24"
            value={valores.massaGorda}
            onChange={(e) => campo("massaGorda", e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper label="Massa magra (%)" htmlFor="massaMagra">
          <Input
            id="massaMagra"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            max="100"
            placeholder="Ex.: 71"
            value={valores.massaMagra}
            onChange={(e) => campo("massaMagra", e.target.value)}
          />
        </FieldWrapper>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-ink">Medidas corporais (cm)</p>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Circunf. torácica" htmlFor="circToracica">
            <Input
              id="circToracica"
              type="number"
              inputMode="decimal"
              min="0"
              value={valores.circunferenciaToracica}
              onChange={(e) => campo("circunferenciaToracica", e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="Circunf. abdominal" htmlFor="circAbdominal">
            <Input
              id="circAbdominal"
              type="number"
              inputMode="decimal"
              min="0"
              value={valores.circunferenciaAbdominal}
              onChange={(e) =>
                campo("circunferenciaAbdominal", e.target.value)
              }
            />
          </FieldWrapper>
          <FieldWrapper label="Comprimento corporal" htmlFor="comprimento">
            <Input
              id="comprimento"
              type="number"
              inputMode="decimal"
              min="0"
              value={valores.comprimentoCorporal}
              onChange={(e) => campo("comprimentoCorporal", e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="Altura de cernelha" htmlFor="altura">
            <Input
              id="altura"
              type="number"
              inputMode="decimal"
              min="0"
              value={valores.alturaCernelha}
              onChange={(e) => campo("alturaCernelha", e.target.value)}
            />
          </FieldWrapper>
        </CardBody>
      </Card>

      <div className="flex items-center gap-4">
        {valores.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={valores.fotoUrl}
            alt="Foto da avaliação"
            className="h-20 w-20 rounded-control border border-line object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-control border border-dashed border-line text-ink-faint">
            <Camera className="h-5 w-5" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFoto}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputFotoRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            {valores.fotoUrl ? "Trocar foto" : "Adicionar foto"}
          </Button>
          {valores.fotoUrl && (
            <button
              type="button"
              onClick={() => campo("fotoUrl", null)}
              className="inline-flex items-center gap-1 self-start text-xs text-ink-muted hover:text-status-high"
            >
              <X className="h-3 w-3" />
              Remover foto
            </button>
          )}
        </div>
      </div>

      <FieldWrapper label="Observações" htmlFor="observacoes">
        <Textarea
          id="observacoes"
          rows={4}
          placeholder="Anotações clínicas sobre esta avaliação…"
          value={valores.observacoes}
          onChange={(e) => campo("observacoes", e.target.value)}
        />
      </FieldWrapper>

      <Button type="submit" full carregando={salvando}>
        Salvar avaliação
      </Button>
    </form>
  );
}
