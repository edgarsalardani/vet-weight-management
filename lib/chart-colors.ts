/**
 * Cores em hex usadas pelos gráficos e ilustrações (Recharts e SVG não leem
 * as classes do Tailwind). Devem acompanhar os tokens de tailwind.config.ts.
 * Aqui os tons de status são um pouco mais vivos que os usados em texto, pois
 * servem apenas a elementos gráficos (contraste mínimo de 3:1 sobre branco).
 */
export const CHART_COLORS = {
  primary: "#2E8B6A",
  primaryLight: "#9FD3BB",
  statusLow: "#3B78C4",
  statusIdeal: "#1F8A58",
  statusHigh: "#C8661F",
  line: "#E3EBE6",
  ink: "#18332B",
  inkMuted: "#4F675E",
};
