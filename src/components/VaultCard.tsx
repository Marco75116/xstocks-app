import Link from "next/link";
import { StockLogo } from "@/components/StockLogo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Vault } from "@/lib/data";
import { getStockByTicker } from "@/lib/data";
import { formatCurrency } from "@/lib/formatters";

export function VaultCard({ vault }: { vault: Vault }) {
  return (
    <Link href={`/vault/${vault.id}`} className="h-full">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold">{vault.name}</h3>
              <p className="text-xs text-muted-foreground">
                {vault.labels[0]?.charAt(0).toUpperCase()}
                {vault.labels[0]?.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {vault.allocations.slice(0, 3).map((alloc) => {
                const stock = getStockByTicker(alloc.ticker);
                return (
                  <StockLogo
                    key={alloc.ticker}
                    ticker={alloc.ticker}
                    color={stock?.color ?? "#666"}
                    logo={stock?.logo}
                    size="sm"
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="font-mono text-xl font-bold">
              {formatCurrency(vault.totalValue)}
            </p>
            <Badge
              variant="secondary"
              className="border-positive/20 bg-positive/10 font-mono text-positive"
            >
              +{vault.dailyGainPercent.toFixed(1)}%
            </Badge>
          </div>

          <Progress
            value={Math.min(vault.dailyGainPercent * 10, 100)}
            className="h-1"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
