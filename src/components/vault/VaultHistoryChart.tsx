"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";

const allData = [
  { date: "Apr 2025", value: 0 },
  { date: "May 2025", value: 320 },
  { date: "Jun 2025", value: 410 },
  { date: "Jul 2025", value: 380 },
  { date: "Aug 2025", value: 520 },
  { date: "Sep 2025", value: 580 },
  { date: "Oct 2025", value: 640 },
  { date: "Nov 2025", value: 710 },
  { date: "Dec 2025", value: 780 },
  { date: "Jan 2026", value: 850 },
  { date: "Feb 2026", value: 920 },
  { date: "Mar 2", value: 980 },
  { date: "Mar 3", value: 1200 },
  { date: "Mar 4", value: 1180 },
  { date: "Mar 5", value: 1250 },
  { date: "Mar 6", value: 1310 },
  { date: "Mar 7", value: 1290 },
  { date: "Mar 8", value: 1350 },
  { date: "Mar 9", value: 1420 },
  { date: "Mar 10", value: 1380 },
  { date: "Mar 11", value: 1400 },
  { date: "Mar 12", value: 1450 },
  { date: "Mar 13", value: 1430 },
  { date: "Mar 14", value: 1520 },
  { date: "Mar 15", value: 1580 },
  { date: "Mar 16", value: 1550 },
  { date: "Mar 17", value: 1600 },
  { date: "Mar 18", value: 1620 },
  { date: "Mar 19", value: 1590 },
  { date: "Mar 20", value: 1650 },
  { date: "Mar 21", value: 1700 },
  { date: "Mar 22", value: 1680 },
  { date: "Mar 23", value: 1720 },
  { date: "Mar 24", value: 1750 },
  { date: "Mar 25", value: 1730 },
  { date: "Mar 26", value: 1780 },
  { date: "Mar 27", value: 1820 },
  { date: "Mar 28", value: 1800 },
  { date: "Mar 29", value: 1850 },
  { date: "Mar 30", value: 1870 },
  { date: "Mar 31", value: 1840 },
  { date: "Apr 1", value: 1890 },
];

type Period = "1m" | "3m" | "6m" | "12m" | "all";

const periods: { key: Period; label: string; count: number }[] = [
  { key: "1m", label: "Last month", count: 31 },
  { key: "3m", label: "Last 3 months", count: 33 },
  { key: "6m", label: "Last 6 months", count: 36 },
  { key: "12m", label: "Last 12 months", count: 39 },
  { key: "all", label: "All history", count: allData.length },
];

const chartConfig = {
  value: {
    label: "Vault Value",
    color: "oklch(0.55 0.15 250)",
  },
} satisfies ChartConfig;

export function VaultHistoryChart() {
  const [period, setPeriod] = useState<Period>("1m");

  const selected = periods.find((p) => p.key === period);
  const data = allData.slice(-(selected?.count ?? allData.length));

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Vault Value</CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily vault value evolution
          </p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.key} value={p.key}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="oklch(0.87 0 0)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => formatCompactCurrency(v)}
              width={60}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => label}
                />
              }
            />
            <defs>
              <linearGradient id="vaultValueFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#vaultValueFill)"
              stroke="var(--color-value)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
