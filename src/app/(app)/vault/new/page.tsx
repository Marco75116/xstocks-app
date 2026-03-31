"use client";

import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ContentLayout } from "@/components/ContentLayout";
import { StockLogo } from "@/components/StockLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStockByTicker } from "@/lib/data";

const previewAllocations = [
  { ticker: "TSLAx", weight: 33 },
  { ticker: "AMZNx", weight: 33 },
  { ticker: "BTC", weight: 34 },
];

const chartData = previewAllocations.map((alloc) => {
  const stock = getStockByTicker(alloc.ticker);
  return {
    name: stock?.name ?? alloc.ticker,
    ticker: alloc.ticker,
    value: alloc.weight,
    color: stock?.color ?? "#666",
  };
});

const chartConfig: ChartConfig = Object.fromEntries(
  chartData.map((d) => [d.ticker, { label: d.name, color: d.color }]),
);

export default function NewVaultPage() {
  const [prompt, setPrompt] = useState(
    "Invest $500 into Tesla, Amazon and Bitcoin, rebalances weekly",
  );

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">New Vault</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="vault-prompt">
              What do you want your money to do? Describe it in your own
              words...
            </Label>
            <Textarea
              id="vault-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-center">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-square h-[140px]"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={60}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.ticker} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>

              <CardTitle className="text-center">
                Tech & Bitcoin Growth
              </CardTitle>

              <div className="space-y-2.5">
                {previewAllocations.map((alloc, index) => {
                  const stock = getStockByTicker(alloc.ticker);
                  return (
                    <div
                      key={alloc.ticker}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-5 items-center justify-center rounded-md bg-muted font-mono text-xs font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <StockLogo
                          ticker={alloc.ticker}
                          color={stock?.color ?? "#666"}
                          logo={stock?.logo}
                          size="sm"
                        />
                        <span className="text-sm font-medium">
                          {stock?.ticker ?? alloc.ticker}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {alloc.weight}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="vault-amount">Amount</Label>
                  <Input
                    id="vault-amount"
                    type="text"
                    defaultValue="$1,000.00"
                    className="text-center font-mono text-xl font-bold h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vault-frequency">Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="vault-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Every Day</SelectItem>
                      <SelectItem value="weekly">Every Week</SelectItem>
                      <SelectItem value="monthly">Every Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full gap-2" size="lg">
                Start this Vault
                <Check className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
