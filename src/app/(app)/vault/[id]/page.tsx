"use client";

import { ArrowLeft, Pause, Pencil, PlusCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ContentLayout } from "@/components/ContentLayout";
import { StockLogo } from "@/components/StockLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { getStockByTicker, getVaultById } from "@/lib/data";
import { formatCurrency } from "@/lib/formatters";

const chartConfig: ChartConfig = {
  totalValue: {
    label: "Vault Value",
    color: "hsl(142 76% 36%)",
  },
};

export default function VaultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vault = getVaultById(id);

  if (!vault) {
    notFound();
  }

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">{vault.name}</h1>
            <Badge
              variant="secondary"
              className="border-positive/20 bg-positive/10 font-mono text-positive uppercase"
            >
              {vault.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <PlusCircle className="size-4" />
              Add Funds
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pause className="size-4" />
              Pause
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Vault Value
              </p>
              <div className="flex items-baseline gap-3">
                <p className="font-mono text-3xl font-bold tracking-tight">
                  {formatCurrency(vault.totalValue)}
                </p>
                <Badge
                  variant="secondary"
                  className="border-positive/20 bg-positive/10 font-mono text-positive"
                >
                  +{formatCurrency(vault.totalGainAmount)} · +
                  {vault.totalGainPercent.toFixed(1)}% all time
                </Badge>
              </div>
            </div>

            <div className="flex h-1.5 gap-px overflow-hidden rounded-full">
              {vault.allocations.map((alloc) => {
                const stock = getStockByTicker(alloc.ticker);
                return (
                  <div
                    key={alloc.ticker}
                    className="h-full"
                    style={{
                      width: `${alloc.weight}%`,
                      backgroundColor: stock?.color ?? "#666",
                    }}
                  />
                );
              })}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    30 Day Performance
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="border-positive/20 bg-positive/10 font-mono text-positive"
                  >
                    Outperforming SPY by {vault.benchmarkDelta}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
                  <AreaChart
                    data={vault.performanceHistory}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="vaultFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(142 76% 36%)"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(142 76% 36%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val: string) => {
                        const d = new Date(val);
                        return `${d.toLocaleString("en", { month: "short" })} ${d.getDate()}`;
                      }}
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                      interval="preserveStartEnd"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalValue"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth={1.5}
                      fill="url(#vaultFill)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Holdings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vault.allocations.map((alloc) => {
                  const stock = getStockByTicker(alloc.ticker);
                  return (
                    <div
                      key={alloc.ticker}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <StockLogo
                          ticker={alloc.ticker}
                          color={stock?.color ?? "#666"}
                          logo={stock?.logo}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {stock?.name ?? alloc.ticker}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {alloc.ticker} · {alloc.weight}%
                          </p>
                        </div>
                      </div>
                      <p className="font-mono text-sm font-semibold">
                        {formatCurrency(alloc.currentValue)}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="mt-0.5 rounded-md bg-positive/10 p-2">
                  <RefreshCw className="size-4 text-positive" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Auto-Rebalance Active</p>
                  <p className="text-xs text-muted-foreground">
                    Every {vault.rebalanceDay} at {vault.rebalanceTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Next rebalance in 3 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
