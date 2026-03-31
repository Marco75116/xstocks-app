import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

export function BalanceHeader({
  totalBalance,
  dailyGainAmount,
  dailyGainPercent,
}: {
  totalBalance: number;
  dailyGainAmount: number;
  dailyGainPercent: number;
  showEmpty?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
      <div className="flex items-baseline gap-4">
        <p className="font-mono text-4xl font-bold tracking-tight">
          {formatCurrency(totalBalance)}
        </p>
        {dailyGainAmount !== 0 && (
          <Badge
            variant="secondary"
            className="border-positive/20 bg-positive/10 font-mono text-positive"
          >
            +{formatCurrency(dailyGainAmount)} · +{dailyGainPercent.toFixed(1)}%
            today
          </Badge>
        )}
      </div>
    </div>
  );
}
