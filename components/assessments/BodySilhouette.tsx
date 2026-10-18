import { classificarEscore } from "@/lib/constants";
import { CHART_COLORS } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

const COR_POR_CATEGORIA = {
  low: CHART_COLORS.statusLow,
  ideal: CHART_COLORS.statusIdeal,
  high: CHART_COLORS.statusHigh,
};

const TAMANHOS = {
  sm: "h-14 w-20",
  md: "h-20 w-28",
  lg: "h-28 w-40",
};

/** Garante um valor de escore válido (1-9) mesmo diante de dados incompletos. */
function normalizarEscore(escore: number): number {
  if (Number.isNaN(escore)) return 5;
  return Math.min(9, Math.max(1, escore));
}

/**
 * Representação ilustrativa e simulada (não gerada por IA, não copiada de
 * associações veterinárias) da condição corporal, usada como apoio visual
 * nas telas de evolução, comparação e relatório.
 *
 * A curva do abdômen é calculada de forma contínua a partir do escore
 * (1 a 9), então cada um dos nove níveis produz uma silhueta ligeiramente
 * diferente — mais "tucked"/côncava nos escores baixos e mais arredondada
 * nos escores altos. Esta ilustração é apenas um apoio visual e NÃO
 * constitui diagnóstico.
 */
export function BodySilhouette({
  escore,
  tamanho = "md",
  className,
}: {
  escore: number;
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
}) {
  const valor = normalizarEscore(escore);
  const categoria = classificarEscore(valor).categoria;
  const cor = COR_POR_CATEGORIA[categoria];

  // Linha das patas (ventre neutro) em y=118; escores baixos puxam a
  // curva do ventre para cima (cintura marcada), escores altos empurram
  // para baixo (abdômen arredondado).
  const bellyY = 118 + (valor - 5) * 7;

  const torsoPath = `M168,58 C145,45 95,45 72,62 C65,80 65,100 78,118 Q120,${bellyY} 162,118 C178,100 178,75 168,58 Z`;

  // Abaixo do peso: sugestão sutil de costelas visíveis (linhas finas).
  const mostrarCostelas = valor <= 3;
  // Acima do peso: reforço sutil de volume abdominal (depósito de gordura).
  const mostrarReforcoAbdominal = valor >= 7;

  return (
    <svg
      viewBox="0 0 240 160"
      className={cn(TAMANHOS[tamanho], className)}
      role="img"
      aria-label={`Ilustração simulada da condição corporal, escore ${valor} de 9`}
    >
      {/* rabo */}
      <path
        d="M72,66 Q40,55 35,30"
        fill="none"
        stroke={cor}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* patas */}
      <rect x={64} y={110} width={12} height={38} rx={6} fill={cor} opacity={0.85} />
      <rect x={86} y={113} width={12} height={35} rx={6} fill={cor} opacity={0.85} />
      <rect x={138} y={113} width={12} height={35} rx={6} fill={cor} opacity={0.85} />
      <rect x={160} y={110} width={12} height={38} rx={6} fill={cor} opacity={0.85} />
      {/* reforço abdominal (apenas escores altos) — desenhado antes do
          contorno do corpo para ficar "por dentro" da silhueta */}
      {mostrarReforcoAbdominal && (
        <ellipse
          cx={118}
          cy={bellyY - 6}
          rx={44}
          ry={16}
          fill={cor}
          fillOpacity={0.14}
        />
      )}
      {/* corpo (a curva do ventre varia conforme o escore, 1-9) */}
      <path d={torsoPath} fill={cor} fillOpacity={0.16} stroke={cor} strokeWidth={3} />
      {/* costelas sutilmente visíveis (apenas escores baixos) */}
      {mostrarCostelas && (
        <g stroke={cor} strokeWidth={1.5} opacity={0.45} fill="none">
          <path d="M100,64 Q104,80 98,96" />
          <path d="M114,60 Q118,78 112,96" />
          <path d="M128,60 Q132,78 126,96" />
        </g>
      )}
      {/* cabeça */}
      <circle cx={186} cy={50} r={19} fill={cor} fillOpacity={0.16} stroke={cor} strokeWidth={3} />
      {/* orelha */}
      <path d="M183,34 L192,18 L199,36 Z" fill={cor} opacity={0.85} />
      {/* focinho */}
      <ellipse cx={206} cy={54} rx={11} ry={7} fill={cor} fillOpacity={0.16} stroke={cor} strokeWidth={2.5} />
      {/* nariz e olho */}
      <circle cx={214} cy={52} r={2.5} fill={cor} />
      <circle cx={193} cy={45} r={2} fill={cor} />
    </svg>
  );
}
