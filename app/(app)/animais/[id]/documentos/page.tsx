"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FolderOpen, Plus, Paperclip, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { Card, CardBody } from "@/components/ui/Card";
import { PageSkeleton } from "@/components/ui/Skeleton";
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
  const { toast } = useToast();
  const [erroTitulo, setErroTitulo] = useState<string | null>(null);
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
    if (!animal) return;
    if (!titulo.trim()) {
      setErroTitulo("Informe o título ou tipo do documento.");
      return;
    }
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
    toast({ titulo: "Documento adicionado", descricao: novo.titulo });
    setMostrarForm(false);
    setTitulo("");
    setDescricao("");
    setNomeArquivo(null);
    setArquivoUrl(null);
    setTipoArquivo("PDF");
    setData(hoje);
  }

  if (carregando) return <PageSkeleton label="Carregando documentos…" />;
  if (!animal) return <p className="text-base text-ink-muted">Animal não encontrado.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Documentos e exames"
        subtitulo={animal.nome}
        voltarPara={`/animais/${animal.id}`}
        acao={
          !mostrarForm && (
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
          )
        }
      />

      {mostrarForm && (
        <Card className="mb-6 animate-pop-in">
          <CardBody>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <h2 className="text-lg font-bold tracking-tight text-ink">Novo documento</h2>

              <FieldWrapper label="Título / tipo" htmlFor="titulo" required erro={erroTitulo ?? undefined}>
                <Input
                  id="titulo"
                  placeholder="Ex.: Hemograma"
                  value={titulo}
                  erro={Boolean(erroTitulo)}
                  onChange={(e) => {
                    setTitulo(e.target.value);
                    if (erroTitulo) setErroTitulo(null);
                  }}
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
                <p className="mb-2 text-sm font-semibold text-ink">Arquivo</p>
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
                  <Paperclip className="h-5 w-5" />
                  {nomeArquivo ? "Trocar arquivo" : "Selecionar arquivo (simulado)"}
                </Button>
                {nomeArquivo && (
                  <p className="mt-2 text-sm font-medium text-ink">{nomeArquivo}</p>
                )}
                <p className="mt-2 text-sm text-ink-muted">
                  Nesta etapa o envio é apenas simulado — nenhum arquivo é
                  enviado a um servidor.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <Button type="submit" carregando={salvando}>
                  Salvar documento
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setMostrarForm(false);
                    setErroTitulo(null);
                  }}
                >
                  <X className="h-5 w-5" />
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
            <Button onClick={() => setMostrarForm(true)}>
              <Plus className="h-5 w-5" />
              Adicionar documento
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {documentos.map((doc) => (
            <DocumentListItem key={doc.id} documento={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
