import { gerarIniciais, cn } from "@/lib/utils";

const tamanhos = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-24 w-24 text-2xl",
};

export function AnimalAvatar({
  nome,
  fotoUrl,
  tamanho = "md",
  className,
}: {
  nome: string;
  fotoUrl?: string | null;
  tamanho?: keyof typeof tamanhos;
  className?: string;
}) {
  if (fotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fotoUrl}
        alt={`Foto de ${nome}`}
        className={cn(
          "rounded-full border border-line object-cover",
          tamanhos[tamanho],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-primary/20 bg-primary-light font-semibold text-primary-dark",
        tamanhos[tamanho],
        className
      )}
      aria-hidden
    >
      {gerarIniciais(nome)}
    </div>
  );
}
