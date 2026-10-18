import { FileText, ExternalLink } from "lucide-react";
import { Documento } from "@/lib/types";
import { IconTile } from "@/components/ui/IconTile";
import { formatarDataCurta } from "@/lib/utils";

export function DocumentListItem({ documento }: { documento: Documento }) {
  const temArquivo = Boolean(documento.arquivoUrl);

  return (
    <article className="flex items-start gap-4 rounded-card border border-line/70 bg-surface p-4 shadow-card sm:p-5">
      <IconTile icon={FileText} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-bold text-ink">{documento.titulo}</p>
          <span className="rounded-full bg-surfaceMuted px-3 py-1 text-xs font-bold uppercase text-ink-muted">
            {documento.tipoArquivo}
          </span>
        </div>
        <p className="text-sm text-ink-muted">{formatarDataCurta(documento.data)}</p>
        {documento.descricao && (
          <p className="mt-2 text-base text-ink-muted">{documento.descricao}</p>
        )}
        {temArquivo ? (
          <a
            href={documento.arquivoUrl!}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-primary-50 px-4 text-sm font-semibold text-primary transition duration-150 hover:bg-primary-100 active:scale-95"
          >
            Visualizar
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">
            Arquivo simulado: a pré-visualização não está disponível neste protótipo.
          </p>
        )}
      </div>
    </article>
  );
}
