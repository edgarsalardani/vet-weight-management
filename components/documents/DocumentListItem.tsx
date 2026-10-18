import { FileText, ExternalLink } from "lucide-react";
import { Documento } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";

export function DocumentListItem({ documento }: { documento: Documento }) {
  const temArquivo = Boolean(documento.arquivoUrl);

  return (
    <div className="flex items-start gap-3.5 rounded-card border border-line bg-surface p-4 shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-light text-primary">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-ink">{documento.titulo}</p>
          <span className="rounded-full bg-surfaceMuted px-2 py-0.5 text-[11px] font-medium uppercase text-ink-muted">
            {documento.tipoArquivo}
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          {formatarDataCurta(documento.data)}
        </p>
        {documento.descricao && (
          <p className="mt-1 text-sm text-ink-muted">{documento.descricao}</p>
        )}
        {temArquivo ? (
          <a
            href={documento.arquivoUrl!}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Visualizar
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="mt-2 text-xs text-ink-faint">
            Arquivo simulado — pré-visualização indisponível neste protótipo.
          </p>
        )}
      </div>
    </div>
  );
}
