"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AvaliacaoCorporal } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chart-colors";

export function WeightChart({
  avaliacoes,
}: {
  avaliacoes: AvaliacaoCorporal[];
}) {
  const dados = avaliacoes.map((a) => ({
    data: formatarDataCurta(a.data),
    peso: a.peso,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
        <XAxis
          dataKey="data"
          tick={{ fontSize: 11, fill: CHART_COLORS.inkMuted }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.line }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: CHART_COLORS.inkMuted }}
          tickLine={false}
          axisLine={false}
          width={40}
          domain={["dataMin - 1", "dataMax + 1"]}
          unit=" kg"
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)} kg`, "Peso"]}
          contentStyle={{
            borderRadius: 8,
            borderColor: CHART_COLORS.line,
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke={CHART_COLORS.primary}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: CHART_COLORS.primary, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
