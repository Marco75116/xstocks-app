"use client";

import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount, useConfig } from "wagmi";
import { switchChain as requestWalletChainSwitch } from "wagmi/actions";
import type { WizardAction, WizardState } from "@/app/(app)/vault/new/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasketTemplateCard } from "@/components/vault-wizard/BasketTemplateCard";
import { StockCard } from "@/components/vault-wizard/StockCard";
import { useChain } from "@/lib/chain-context";
import {
  CHAIN_CONFIGS,
  SUPPORTED_CHAIN_IDS,
  type SupportedChainId,
} from "@/lib/constants";
import { BASKETS, getStocksByChainId } from "@/lib/data";
import { walletErrorMessage } from "@/lib/walletErrorMessage";

export function StockSelectionStep({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const { chainId, setChainId } = useChain();
  const wagmiConfig = useConfig();
  const { isConnected, connector } = useAccount();
  const [isSwitchPending, setIsSwitchPending] = useState(false);

  const prevChainId = useRef(chainId);
  useEffect(() => {
    if (prevChainId.current !== chainId) {
      prevChainId.current = chainId;
      dispatch({ type: "RESET_SELECTIONS" });
    }
  }, [chainId, dispatch]);

  const handleChainChange = useCallback(
    (value: string) => {
      const id = Number(value) as SupportedChainId;
      if (id === chainId) return;
      if (!isConnected) {
        setChainId(id);
        return;
      }
      if (!connector) return;
      setIsSwitchPending(true);
      void requestWalletChainSwitch(wagmiConfig, { chainId: id, connector })
        .then(() => setChainId(id))
        .catch((err: unknown) => toast.error(walletErrorMessage(err)))
        .finally(() => setIsSwitchPending(false));
    },
    [chainId, connector, isConnected, setChainId, wagmiConfig],
  );
  const stocks = useMemo(() => getStocksByChainId(chainId), [chainId]);
  const sectors = useMemo(
    () => ["All", ...new Set(stocks.map((s) => s.sector))],
    [stocks],
  );
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        search === "" ||
        stock.ticker.toLowerCase().includes(search.toLowerCase()) ||
        stock.name.toLowerCase().includes(search.toLowerCase());
      const matchesSector =
        sectorFilter === "All" || stock.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [search, sectorFilter, stocks]);

  const availableBaskets = useMemo(() => {
    const tickerSet = new Set(stocks.map((s) => s.ticker));
    return BASKETS.filter((b) =>
      b.allocations.every((a) => tickerSet.has(a.ticker)),
    );
  }, [stocks]);

  const isBasketSelected = (basketId: string) => {
    const basket = BASKETS.find((b) => b.id === basketId);
    if (!basket) return false;
    const basketTickers = basket.allocations.map((a) => a.ticker).sort();
    const selectedSorted = [...state.selectedTickers].sort();
    return (
      basketTickers.length === selectedSorted.length &&
      basketTickers.every((t, i) => t === selectedSorted[i])
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={String(chainId)} onValueChange={handleChainChange}>
        <TabsList className="h-9">
          {SUPPORTED_CHAIN_IDS.map((id) => {
            const chain = CHAIN_CONFIGS[id];
            return (
              <TabsTrigger
                key={id}
                value={String(id)}
                disabled={isSwitchPending}
                className="gap-2 px-4"
              >
                <Image
                  src={chain.logo}
                  alt={chain.name}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
                {chain.shortName}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {availableBaskets.length > 0 && (
        <>
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Quick Start
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {availableBaskets.map((basket) => (
                <BasketTemplateCard
                  key={basket.id}
                  basket={basket}
                  selected={isBasketSelected(basket.id)}
                  onApply={() =>
                    dispatch({ type: "APPLY_BASKET", basketId: basket.id })
                  }
                />
              ))}
            </div>
          </div>

          <Separator />
        </>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sectors.map((sector) => (
            <Badge
              key={sector}
              variant={sectorFilter === sector ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSectorFilter(sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredStocks.map((stock, i) => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              selected={state.selectedTickers.includes(stock.ticker)}
              onToggle={() =>
                dispatch({ type: "TOGGLE_STOCK", ticker: stock.ticker })
              }
              index={i}
            />
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No stocks match your search
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          disabled={state.selectedTickers.length === 0}
          className="gap-2"
        >
          Continue to Allocation
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
