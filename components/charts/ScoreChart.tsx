"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import { AvaliacaoCorporal } from "@/lib/types";
import { formatarDataCurta } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chart-colors";

export function ScoreChart({
  avaliacoes,
}: {
  avaliacoes: AvaliacaoCorporal[];
}) {
  const dados = avaliacoes.map((a) => ({
    data: formatarDataCurta(a.data),
    escore: a.escoreCorporal,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        {/* Faixa ideal (4-5) destacada como referência visual */}
        <ReferenceArea
          y1={4}
          y2={5}
          fill={CHART_COLORS.statusIdeal}
          fillOpacity={0.08}
          ifOverflow="extendDomain"
        />
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
          width={28}
          domain={[1, 9]}
          ticks={[1, 3, 5, 7, 9]}
        />
        <Tooltip
          formatter={(value: number) => [`${value} / 9`, "ECC"]}
          contentStyle={{
            borderRadius: 8,
            borderColor: CHART_COLORS.line,
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="escore"
          stroke={CHART_COLORS.statusHigh}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: CHART_COLORS.statusHigh, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
