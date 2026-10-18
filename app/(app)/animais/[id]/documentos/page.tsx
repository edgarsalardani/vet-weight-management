"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FolderOpen, Plus, Paperclip, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { Card, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentListItem } from "@/components/documents/DocumentListItem";
import { buscarAnimalPorId } from "@/lib/services/animalService";
import {
  criarDocumento,
  listarDocumentosPorAnimal,
} from "@/lib/services/documentService";
import { Animal, Documento } from "@/lib/types";

const hoje = new Date().toISOString().slice(0, 10);

export default function DocumentosPage({
  params,
}: {
  params: { id: string };
}) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [tipoArquivo, setTipoArquivo] = useState("PDF");
  const [data, setData] = useState(hoje);
  const [descricao, setDescricao] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [arquivoUrl, setArquivoUrl] = useState<string | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const [a, docs] = await Promise.all([
        buscarAnimalPorId(params.id),
        listarDocumentosPorAnimal(params.id),
      ]);
      if (!ativo) return;
      setAnimal(a);
      setDocumentos(docs);
      setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [params.id]);

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setNomeArquivo(arquivo.name);
    setTipoArquivo(arquivo.type.includes("pdf") ? "PDF" : arquivo.type.split("/")[1]?.toUpperCase() || "Arquivo");
    const leitor = new FileReader();
    leitor.onload = () => setArquivoUrl(leitor.result as string);
    leitor.readAsDataURL(arquivo);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !animal) return;
    setSalvando(true);
    const novo = await criarDocumento({
      animalId: animal.id,
      titulo: titulo.trim(),
      tipoArquivo,
      data,
      descricao: descricao.trim() || undefined,
      arquivoUrl,
    });
    setDocumentos((docs) => [novo, ...docs]);
    setSalvando(false);
    setMostrarForm(false);
    setTitulo("");
    setDescricao("");
    setNomeArquivo(null);
    setArquivoUrl(null);
    setTipoArquivo("PDF");
    setData(hoje);
  }

  if (carregando) return <Spinner label="Carregando documentos…" />;
  if (!animal) return <p className="text-ink-muted">Animal não encontrado.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Documentos e exames"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}`}
        acao={
          !mostrarForm && (
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
          )
        }
      />

      {mostrarForm && (
        <Card className="mb-5">
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-medium text-ink">Novo documento</p>

              <FieldWrapper label="Título / tipo" htmlFor="titulo" required>
                <Input
                  id="titulo"
                  placeholder="Ex.: Hemograma"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper label="Data" htmlFor="dataDoc" required>
                <Input
                  id="dataDoc"
                  type="date"
                  value={data}
                  max={hoje}
                  onChange={(e) => setData(e.target.value)}
                />
              </FieldWrapper>

              <FieldWrapper label="Descrição (opcional)" htmlFor="descricaoDoc">
                <Textarea
                  id="descricaoDoc"
                  rows={2}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FieldWrapper>

              <div>
                <p className="mb-1.5 text-sm font-medium text-ink">Arquivo</p>
                <input
                  ref={inputArquivoRef}
                  type="file"
                  className="hidden"
                  onChange={handleArquivo}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => inputArquivoRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  {nomeArquivo ? "Trocar arquivo" : "Selecionar arquivo (simulado)"}
                </Button>
                {nomeArquivo && (
                  <p className="mt-1.5 text-xs text-ink-muted">{nomeArquivo}</p>
                )}
                <p className="mt-1.5 text-xs text-ink-faint">
                  Nesta etapa o envio é apenas simulado — nenhum arquivo é
                  enviado a um servidor.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" carregando={salvando}>
                  Salvar documento
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMostrarForm(false)}
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {documentos.length === 0 && !mostrarForm ? (
        <EmptyState
          icon={FolderOpen}
          titulo="Nenhum documento registrado"
          descricao="Adicione exames e outros documentos relacionados a este paciente."
          acao={
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-4 w-4" />
              Adicionar documento
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {documentos.map((doc) => (
            <DocumentListItem key={doc.id} documento={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
