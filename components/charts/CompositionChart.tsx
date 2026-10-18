"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AvaliacaoCorporal } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chart-colors";

export function CompositionChart({
  avaliacoes,
}: {
  avaliacoes: AvaliacaoCorporal[];
}) {
  const dados = avaliacoes
    .filter((a) => a.massaGorda != null || a.massaMagra != null)
    .map((a) => ({
      data: formatarDataCurta(a.data),
      "Massa gorda": a.massaGorda ?? undefined,
      "Massa magra": a.massaMagra ?? undefined,
    }));

  if (dados.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
        <XAxis
          dataKey="data"
          tick={{ fontSize: 13, fill: CHART_COLORS.inkMuted }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.line }}
        />
        <YAxis
          tick={{ fontSize: 13, fill: CHART_COLORS.inkMuted }}
          tickLine={false}
          axisLine={false}
          width={36}
          unit="%"
        />
        <Tooltip
          formatter={(value: number) => `${value}%`}
          contentStyle={{
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(24, 51, 43, 0.12)",
            padding: "10px 14px",
            borderColor: CHART_COLORS.line,
            fontSize: 14,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 14, color: CHART_COLORS.inkMuted }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="Massa gorda"
          stroke={CHART_COLORS.statusHigh}
          fill={CHART_COLORS.statusHigh}
          fillOpacity={0.12}
          strokeWidth={2.5}
        />
        <Area
          type="monotone"
          dataKey="Massa magra"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.12}
          strokeWidth={2.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
