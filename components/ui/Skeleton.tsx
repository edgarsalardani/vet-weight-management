import { cn } from "@/lib/utils";

/** Bloco de carregamento com brilho suave (parado quando o usuário prefere menos movimento). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-control bg-gradient-to-r from-primary-50 via-white to-primary-50 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

/** Esqueleto de página: mostra a "forma" do conteúdo enquanto os dados carregam. */
export function PageSkeleton({ label = "Carregando…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="mx-auto w-full max-w-3xl space-y-5">
      <span className="sr-only">{label}</span>
      <div className="space-y-3">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <Skeleton className="h-40 w-full rounded-card" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-card" />
        <Skeleton className="h-24 rounded-card" />
      </div>
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}
