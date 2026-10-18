"use client";

import { FormEvent, useState } from "react";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn, dataRelativaAHoje } from "@/lib/utils";
import { Animal, NovoCompromisso } from "@/lib/types";

const hoje = dataRelativaAHoje(0);

type Atalho = "15" | "30" | "outra";

export function NewAppointmentForm({
  animais,
  animalIdPadrao,
  onSalvar,
  onCancelar,
  salvando = false,
}: {
  animais: Animal[];
  animalIdPadrao?: string;
  onSalvar: (dados: NovoCompromisso) => Promise<void>;
  onCancelar: () => void;
  salvando?: boolean;
}) {
  const [animalId, setAnimalId] = useState(animalIdPadrao ?? animais[0]?.id ?? "");
  const [atalho, setAtalho] = useState<Atalho>("15");
  const [data, setData] = useState(dataRelativaAHoje(15));
  const [horario, setHorario] = useState("14:00");
  const [orientacao, setOrientacao] = useState("");

  function escolherAtalho(opcao: Atalho) {
    setAtalho(opcao);
    if (opcao === "15") setData(dataRelativaAHoje(15));
    if (opcao === "30") setData(dataRelativaAHoje(30));
    // "outra" mantém a data atual do campo, liberando edição manual
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!animalId || !data) return;
    await onSalvar({
      animalId,
      tipo: "retorno_clinico",
      titulo: "Retorno do programa de controle de peso",
      data,
      horario: horario || undefined,
      orientacaoRetorno: orientacao.trim() || undefined,
      statusConfirmacao: "aguardando",
      status: "agendado",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-medium text-ink">Novo retorno</p>

      <FieldWrapper label="Paciente" htmlFor="animalRetorno" required>
        <Select
          id="animalRetorno"
          value={animalId}
          onChange={(e) => setAnimalId(e.target.value)}
        >
          {animais.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </Select>
      </FieldWrapper>

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Data do retorno</p>
        <div className="flex flex-wrap gap-2">
          {(["15", "30", "outra"] as Atalho[]).map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => escolherAtalho(opcao)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                atalho === opcao
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-white text-ink-muted hover:border-primary/50"
              )}
            >
              {opcao === "15" ? "Em 15 dias" : opcao === "30" ? "Em 30 dias" : "Escolher outra data"}
            </button>
          ))}
        </div>
        <Input
          className="mt-2"
          type="date"
          min={hoje}
          value={data}
          onChange={(e) => {
            setAtalho("outra");
            setData(e.target.value);
          }}
        />
      </div>

      <FieldWrapper label="Horário" htmlFor="horarioRetorno">
        <Input
          id="horarioRetorno"
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Orientações para o retorno"
        htmlFor="orientacaoRetorno"
        ajuda='Ex.: "Paciente deve estar em jejum alimentar de 12 horas."'
      >
        <Textarea
          id="orientacaoRetorno"
          rows={2}
          placeholder="Orientação a ser exibida também para o responsável…"
          value={orientacao}
          onChange={(e) => setOrientacao(e.target.value)}
        />
      </FieldWrapper>

      <div className="flex gap-2">
        <Button type="submit" carregando={salvando}>
          Agendar retorno
        </Button>
        <Button type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
