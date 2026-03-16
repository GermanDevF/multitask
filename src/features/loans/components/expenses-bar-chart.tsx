"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents } from "@/features/expenses/domain/calc";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MonthlyExpensePoint = {
  label: string;
  year: number;
  month: number;
  totalCents: number;
  byPerson?: Record<string, number>;
};

type ExpensesBarChartProps = {
  data: MonthlyExpensePoint[];
  currency: string;
};

type ChartVariant = "stacked" | "total" | "line";

const STACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatAxisValue(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
}

export function ExpensesBarChart({ data, currency }: ExpensesBarChartProps) {
  const [variant, setVariant] = useState<ChartVariant>("stacked");

  if (!data.length) return null;

  const payers = [
    ...new Set(data.flatMap((d) => Object.keys(d.byPerson ?? {}))),
  ].filter(Boolean);

  const chartData = data.map((d) => {
    const total = d.totalCents / 100;
    const byPersonUnits: Record<string, number> = {};
    for (const [name, cents] of Object.entries(d.byPerson ?? {})) {
      byPersonUnits[name] = cents / 100;
    }
    return {
      label: d.label,
      year: d.year,
      month: d.month,
      totalCents: d.totalCents,
      amount: total,
      fullLabel: formatCents(d.totalCents, currency),
      ...byPersonUnits,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Gastos por mes
        </CardTitle>
        <div className="inline-flex items-center gap-1 rounded-full border bg-muted/40 p-0.5 text-[11px]">
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              variant === "stacked"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setVariant("stacked")}>
            Por persona
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              variant === "total"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setVariant("total")}>
            Total
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              variant === "line"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setVariant("line")}>
            Tendencia
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="h-40 w-full sm:h-44" aria-label="Gastos por mes">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "line" ? (
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  dataKey="amount"
                  tickFormatter={formatAxisValue}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="min-w-[140px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
                        <p className="mb-1.5 font-medium">{row.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Total: {row.fullLabel}
                        </p>
                      </div>
                    );
                  }}
                  cursor={{ stroke: "var(--muted)", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  dataKey="amount"
                  tickFormatter={formatAxisValue}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row =
                      payload[0].payload as (typeof chartData)[number] &
                      Record<string, unknown>;
                    const totalCents = (row.totalCents ?? 0) as number;

                    if (variant === "total" || !payers.length) {
                      return (
                        <div className="min-w-[140px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
                          <p className="mb-1.5 font-medium">{row.label}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: {row.fullLabel}
                          </p>
                        </div>
                      );
                    }

                    const entries = payers
                      .map((name) => {
                        const amountUnits =
                          (row[name] as number | undefined) ?? 0;
                        const cents = Math.round(amountUnits * 100);
                        const pct =
                          totalCents > 0
                            ? Math.round((cents / totalCents) * 100)
                            : 0;
                        return { name, cents, pct };
                      })
                      .filter((e) => e.cents > 0);

                    return (
                      <div className="min-w-[160px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
                        <p className="mb-1.5 font-medium">{row.label}</p>
                        <p className="mb-2 text-xs text-muted-foreground">
                          Total: {row.fullLabel}
                        </p>
                        <ul className="space-y-1">
                          {entries.map(({ name, cents, pct }) => (
                            <li
                              key={name}
                              className="flex justify-between gap-4 text-xs">
                              <span>{name}</span>
                              <span className="tabular-nums">
                                {formatCents(cents, currency)} ({pct}%)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }}
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                />
                {variant === "stacked" && payers.length > 0 ? (
                  payers.map((name, i) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      stackId="gastos"
                      fill={STACK_COLORS[i % STACK_COLORS.length]}
                      radius={
                        i === payers.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                      }
                      maxBarSize={48}
                    />
                  ))
                ) : (
                  <Bar
                    dataKey="amount"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        {variant === "stacked" && payers.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t pt-2 text-[11px] text-muted-foreground">
            {payers.map((name, i) => (
              <span key={name} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: STACK_COLORS[i % STACK_COLORS.length] }}
                />
                {name}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

