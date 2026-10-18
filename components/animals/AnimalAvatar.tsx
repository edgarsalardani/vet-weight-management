import { gerarIniciais, cn } from "@/lib/utils";

const tamanhos = {
  sm: "h-11 w-11 text-base",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
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
          "shrink-0 rounded-full object-cover ring-4 ring-white shadow-card",
          tamanhos[tamanho],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-50 font-bold text-primary-dark ring-4 ring-white shadow-card",
        tamanhos[tamanho],
        className
      )}
      aria-hidden
    >
      {gerarIniciais(nome)}
    </div>
  );
}
