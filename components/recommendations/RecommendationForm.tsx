"use client";

import { FormEvent, useState } from "react";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { NovaRecomendacao } from "@/lib/types";

interface Props {
  animalId: string;
  onSalvar: (dados: NovaRecomendacao) => Promise<void>;
  salvando?: boolean;
}

const hoje = new Date().toISOString().slice(0, 10);

const valoresIniciais = {
  data: hoje,
  alimentoPrincipal: "",
  petisco: "",
  agua: "Fornecer água à vontade.",
  atividadeFisica: "",
  outrasOrientacoes: "",
};

export function RecommendationForm({ animalId, onSalvar, salvando = false }: Props) {
  const [valores, setValores] = useState(valoresIniciais);

  function campo<K extends keyof typeof valoresIniciais>(
    chave: K,
    valor: string
  ) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSalvar({
      animalId,
      data: valores.data,
      alimentoPrincipal: valores.alimentoPrincipal.trim() || undefined,
      petisco: valores.petisco.trim() || undefined,
      agua: valores.agua.trim() || undefined,
      atividadeFisica: valores.atividadeFisica.trim() || undefined,
      outrasOrientacoes: valores.outrasOrientacoes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="rounded-control border border-line bg-surfaceMuted/60 px-3.5 py-3 text-xs text-ink-muted">
        Cada bloco abaixo é exibido separadamente para o responsável (nunca
        como um texto único). Todo o conteúdo é de preenchimento livre pela
        médica-veterinária — o sistema não calcula quantidades, calorias ou
        condutas.
      </p>

      <FieldWrapper label="Data" htmlFor="data" required>
        <Input
          id="data"
          type="date"
          value={valores.data}
          max={hoje}
          onChange={(e) => campo("data", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Alimento principal"
        htmlFor="alimentoPrincipal"
        ajuda='Ex.: "100 gramas por dia, dividido em três refeições diárias, sendo aproximadamente 33 gramas por refeição."'
      >
        <Textarea
          id="alimentoPrincipal"
          rows={2}
          placeholder="Quantidade diária, divisão das refeições e quantidade por refeição…"
          value={valores.alimentoPrincipal}
          onChange={(e) => campo("alimentoPrincipal", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Petisco"
        htmlFor="petisco"
        ajuda='Ex.: "100 gramas de pepino, fornecido ao longo do dia."'
      >
        <Textarea
          id="petisco"
          rows={2}
          placeholder="Petisco/alimento permitido e forma de oferecer…"
          value={valores.petisco}
          onChange={(e) => campo("petisco", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Água" htmlFor="agua">
        <Input
          id="agua"
          placeholder="Ex.: Fornecer água à vontade."
          value={valores.agua}
          onChange={(e) => campo("agua", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Atividade física"
        htmlFor="atividadeFisica"
        ajuda='Ex.: "Caminhadas leves de até 15 minutos, diariamente ou em dias alternados."'
      >
        <Input
          id="atividadeFisica"
          placeholder="Ex.: Caminhadas leves de até 15 minutos por dia"
          value={valores.atividadeFisica}
          onChange={(e) => campo("atividadeFisica", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Outras orientações" htmlFor="outrasOrientacoes">
        <Textarea
          id="outrasOrientacoes"
          rows={3}
          placeholder="Orientações complementares para o responsável…"
          value={valores.outrasOrientacoes}
          onChange={(e) => campo("outrasOrientacoes", e.target.value)}
        />
      </FieldWrapper>

      <Button type="submit" full carregando={salvando}>
        Salvar recomendação
      </Button>
    </form>
  );
}
