"use client";

import { AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { StockLogo } from "@/components/StockLogo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getStockByTicker } from "@/lib/data";
import { api } from "@/lib/eden";
import { formatCurrency } from "@/lib/formatters";

type Order = {
  id: string;
  ticker: string;
  tokenAddress: string;
  sellAmountUsdc: string;
  orderUid: string | null;
  status: string;
  error: string | null;
  createdAt: string;
};

const statusConfig = {
  submitted: {
    label: "Submitted",
    icon: Clock,
    variant: "secondary" as const,
  },
  filled: {
    label: "Filled",
    icon: CheckCircle2,
    variant: "default" as const,
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    variant: "destructive" as const,
  },
};

function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function OrdersHistory({ vaultId }: { vaultId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await api.vault({ id: vaultId }).orders.get();
      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [vaultId]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Order History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No orders yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Order History</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {orders.map((order, i) => {
          const stock = getStockByTicker(order.ticker);
          const config =
            statusConfig[order.status as keyof typeof statusConfig] ??
            statusConfig.submitted;
          const StatusIcon = config.icon;

          return (
            <div key={order.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <StockLogo
                    ticker={order.ticker}
                    color={stock?.color ?? "#666"}
                    logo={stock?.logo}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {stock?.name ?? order.ticker}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono text-sm font-medium">
                    {formatCurrency(Number(order.sellAmountUsdc))}
                  </p>
                  <Badge variant={config.variant} className="gap-1">
                    <StatusIcon className="size-3" />
                    {config.label}
                  </Badge>
                  {order.orderUid && (
                    <a
                      href={`https://explorer.cow.fi/ink/orders/${order.orderUid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
