"use client";

import { FormEvent, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { FieldWrapper, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FormActions } from "@/components/ui/FormActions";
import { AnimalAvatar } from "@/components/animals/AnimalAvatar";
import { PORTE_OPTIONS, SEXO_OPTIONS } from "@/lib/constants";
import { NovoAnimal, Porte, Sexo } from "@/lib/types";

interface Props {
  onSalvar: (dados: NovoAnimal) => Promise<void>;
  salvando?: boolean;
}

const valoresIniciais = {
  nome: "",
  raca: "",
  sexo: "" as Sexo | "",
  dataNascimento: "",
  porte: "" as Porte | "",
  responsavelNome: "",
  fotoUrl: null as string | null,
};

export function AnimalForm({ onSalvar, salvando = false }: Props) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState<Record<string, string>>({});
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const alterado = JSON.stringify(valores) !== JSON.stringify(valoresIniciais);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      setValores((v) => ({ ...v, fotoUrl: leitor.result as string }));
    };
    leitor.readAsDataURL(arquivo);
  }

  function validar(): boolean {
    const novosErros: Record<string, string> = {};
    if (!valores.nome.trim()) novosErros.nome = "Informe o nome do animal.";
    if (!valores.raca.trim()) novosErros.raca = "Informe a raça.";
    if (!valores.sexo) novosErros.sexo = "Selecione o sexo.";
    if (!valores.dataNascimento)
      novosErros.dataNascimento = "Informe a data de nascimento.";
    if (!valores.porte) novosErros.porte = "Selecione o porte.";
    if (!valores.responsavelNome.trim())
      novosErros.responsavelNome = "Informe o nome do responsável.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    await onSalvar({
      nome: valores.nome.trim(),
      raca: valores.raca.trim(),
      sexo: valores.sexo as Sexo,
      dataNascimento: valores.dataNascimento,
      porte: valores.porte as Porte,
      responsavelNome: valores.responsavelNome.trim(),
      fotoUrl: valores.fotoUrl,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <AnimalAvatar
          nome={valores.nome || "?"}
          fotoUrl={valores.fotoUrl}
          tamanho="lg"
        />
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
              onClick={() => setValores((v) => ({ ...v, fotoUrl: null }))}
              className="inline-flex h-11 items-center gap-1.5 self-start text-sm font-semibold text-ink-muted transition hover:text-danger"
            >
              <X className="h-3 w-3" />
              Remover foto
            </button>
          )}
        </div>
      </div>

      <FieldWrapper label="Nome do animal" htmlFor="nome" required erro={erros.nome}>
        <Input
          id="nome"
          placeholder="Ex.: Thor"
          value={valores.nome}
          onChange={(e) => setValores((v) => ({ ...v, nome: e.target.value }))}
          erro={Boolean(erros.nome)}
        />
      </FieldWrapper>

      <FieldWrapper label="Raça" htmlFor="raca" required erro={erros.raca}>
        <Input
          id="raca"
          placeholder="Ex.: Labrador Retriever"
          value={valores.raca}
          onChange={(e) => setValores((v) => ({ ...v, raca: e.target.value }))}
          erro={Boolean(erros.raca)}
        />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Sexo" htmlFor="sexo" required erro={erros.sexo}>
          <Select
            id="sexo"
            value={valores.sexo}
            onChange={(e) =>
              setValores((v) => ({ ...v, sexo: e.target.value as Sexo }))
            }
            erro={Boolean(erros.sexo)}
          >
            <option value="">Selecione</option>
            {SEXO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper label="Porte" htmlFor="porte" required erro={erros.porte}>
          <Select
            id="porte"
            value={valores.porte}
            onChange={(e) =>
              setValores((v) => ({ ...v, porte: e.target.value as Porte }))
            }
            erro={Boolean(erros.porte)}
          >
            <option value="">Selecione</option>
            {PORTE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Data de nascimento"
        htmlFor="dataNascimento"
        required
        erro={erros.dataNascimento}
      >
        <Input
          id="dataNascimento"
          type="date"
          value={valores.dataNascimento}
          onChange={(e) =>
            setValores((v) => ({ ...v, dataNascimento: e.target.value }))
          }
          erro={Boolean(erros.dataNascimento)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Nome do responsável"
        htmlFor="responsavelNome"
        required
        erro={erros.responsavelNome}
      >
        <Input
          id="responsavelNome"
          placeholder="Ex.: Marcos Almeida"
          value={valores.responsavelNome}
          onChange={(e) =>
            setValores((v) => ({ ...v, responsavelNome: e.target.value }))
          }
          erro={Boolean(erros.responsavelNome)}
        />
      </FieldWrapper>

      <FormActions salvarLabel="Cadastrar animal" salvando={salvando} alterado={alterado} />
    </form>
  );
}
