"use client";

import { Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useReadContracts } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { erc20Abi } from "@/lib/abis/erc20";
import { getChainConfig } from "@/lib/constants";
import { api } from "@/lib/eden";

type Composition = {
  ticker: string;
  tokenAddress: string;
  weight: number;
};

type LiquidateState = "idle" | "liquidating" | "done" | "error";

export function LiquidateButton({
  vaultId,
  smartAccountAddress,
  compositions,
  chainId,
}: {
  vaultId: string;
  smartAccountAddress: string;
  compositions: Composition[];
  chainId: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<LiquidateState>("idle");
  const [error, setError] = useState<string | null>(null);
  const chainConfig = getChainConfig(chainId);

  const account = smartAccountAddress as `0x${string}`;

  const balanceContracts = compositions.map((comp) => ({
    address: comp.tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf" as const,
    args: [account],
    chainId: chainConfig.chainId,
  }));

  const { data: balanceData } = useReadContracts({
    contracts: balanceContracts,
    query: { enabled: open },
  });

  function getTokensWithBalance(): number {
    if (!balanceData) return 0;
    return compositions.filter((_, i) => {
      const balance =
        balanceData[i]?.status === "success"
          ? BigInt(balanceData[i].result as bigint)
          : BigInt(0);
      return balance > BigInt(0);
    }).length;
  }

  async function handleLiquidate() {
    setError(null);
    setState("liquidating");

    const { data, error: apiError } = await api.liquidate.post({ vaultId });

    if (apiError || !data) {
      setError("Liquidation failed. Please try again.");
      setState("error");
      return;
    }

    const succeeded = data.results.filter(
      (r: { orderUid?: string }) => r.orderUid,
    ).length;
    const failed = data.results.length - succeeded;

    setState("done");

    if (succeeded > 0) {
      toast.success(
        `Liquidation submitted: ${succeeded} sell order${succeeded > 1 ? "s" : ""} placed`,
      );
    }
    if (failed > 0) {
      toast.error(`${failed} order${failed > 1 ? "s" : ""} failed to submit`);
    }
  }

  const tokensWithBalance = getTokensWithBalance();
  const isLoading = state === "liquidating";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isLoading) {
          setOpen(v);
          if (!v) {
            setState("idle");
            setError(null);
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2 w-full gap-1.5">
          <TrendingUp className="size-3.5" />
          Trigger Odds Threshold
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <Loader2 className="size-10 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-semibold">Executing Signal Action</p>
              <p className="text-sm text-muted-foreground">
                Submitting sell orders to CoW Protocol...
              </p>
            </div>
          </div>
        ) : state === "done" ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <ShieldCheck className="size-10 text-emerald-500" />
            <div className="text-center">
              <p className="text-lg font-semibold">Liquidation Submitted</p>
              <p className="text-sm text-muted-foreground">
                Sell orders have been submitted to CoW Protocol. Positions will
                be converted to USDC once filled.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Trigger Odds Threshold</DialogTitle>
              <DialogDescription>
                This will execute the signal action and sell all holdings back
                to USDC via CoW Protocol.{" "}
                {tokensWithBalance > 0
                  ? `${tokensWithBalance} token${tokensWithBalance > 1 ? "s" : ""} with balance will be sold.`
                  : "No tokens with balance found."}
              </DialogDescription>
            </DialogHeader>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="gap-1.5"
                onClick={handleLiquidate}
                disabled={tokensWithBalance === 0}
              >
                <TrendingUp className="size-4" />
                Confirm
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
