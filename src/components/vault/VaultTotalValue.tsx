"use client";

import { useReadContracts } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { erc20Abi } from "@/lib/abis/erc20";
import { INK_CHAIN_ID, USDC_ADDRESS } from "@/lib/constants";
import { getStockByTicker } from "@/lib/data";
import { formatCurrency } from "@/lib/formatters";

type Composition = {
  ticker: string;
  tokenAddress: string;
  weight: number;
};

export function VaultTotalValue({
  smartAccountAddress,
  compositions,
}: {
  smartAccountAddress: string;
  compositions: Composition[];
}) {
  const account = smartAccountAddress as `0x${string}`;

  const contracts = [
    {
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [account],
      chainId: INK_CHAIN_ID,
    },
    ...compositions.map((comp) => ({
      address: comp.tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [account],
      chainId: INK_CHAIN_ID,
    })),
  ];

  const { data, isLoading } = useReadContracts({ contracts });

  if (isLoading || !data) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          Total Vault Value
        </p>
        <Skeleton className="h-9 w-40" />
      </div>
    );
  }

  const usdcBalance =
    data[0].status === "success" ? Number(data[0].result) / 1e6 : 0;

  let stockValue = 0;
  for (let i = 0; i < compositions.length; i++) {
    const result = data[i + 1];
    if (result.status === "success") {
      const stock = getStockByTicker(compositions[i].ticker);
      const balance = Number(result.result) / 1e18;
      stockValue += balance * (stock?.price ?? 0);
    }
  }

  const totalValue = usdcBalance + stockValue;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">
        Total Vault Value
      </p>
      <p className="font-mono text-3xl font-bold tracking-tight">
        {formatCurrency(totalValue)}
      </p>
    </div>
  );
}
