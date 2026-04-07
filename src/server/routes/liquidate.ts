import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { type Address, isAddress } from "viem";
import { erc20Abi } from "@/lib/abis/erc20";
import {
  buildSellOrder,
  COW_API_BASE_URL,
  GPV2_DOMAIN,
  GPV2_ORDER_TYPES,
  orderToApiPayload,
} from "@/lib/cow";
import { getPublicClient, getWalletClient } from "@/lib/viemClient";
import { db } from "@/server/db";
import { sellOrder, vault, vaultComposition } from "@/server/db/schema";

type SellResult = {
  sellToken: string;
  ticker: string;
  sellAmount: string;
  orderUid?: string;
  error?: string;
};

async function submitCowSellOrder(
  userAccountAddress: Address,
  sellToken: Address,
  sellAmount: bigint,
): Promise<{ orderUid?: string; error?: string }> {
  const order = buildSellOrder({ userAccountAddress, sellToken, sellAmount });

  let signature: string;
  try {
    signature = await getWalletClient().signTypedData({
      domain: GPV2_DOMAIN,
      types: GPV2_ORDER_TYPES,
      primaryType: "Order",
      message: order,
    });
  } catch (err) {
    console.error(
      `[liquidate] Failed to sign sell order for ${sellToken}:`,
      err,
    );
    return { error: "Order signing failed" };
  }

  const payload = orderToApiPayload(order, signature, userAccountAddress);

  const response = await fetch(`${COW_API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `[liquidate] CoW API error for ${sellToken} (${response.status}):`,
      errorBody,
    );
    let description = "CoW API order submission failed";
    try {
      const parsed = JSON.parse(errorBody) as { description?: string };
      if (parsed.description) description = parsed.description;
    } catch {}
    return { error: description };
  }

  const orderUid = (await response.json()) as string;
  console.info(
    `[liquidate] CoW sell order submitted for ${sellToken}: ${orderUid}`,
  );
  return { orderUid };
}

export const liquidateRoutes = new Elysia().post(
  "/liquidate",
  async ({ body }) => {
    const { vaultId } = body;

    console.info(`[liquidate] POST /liquidate — vaultId=${vaultId}`);

    const [found] = await db
      .select()
      .from(vault)
      .where(eq(vault.id, vaultId))
      .limit(1);

    if (!found) {
      throw new Error("Vault not found");
    }

    if (!found.smartAccountAddress || !isAddress(found.smartAccountAddress)) {
      throw new Error("Vault has no smart account");
    }

    if (found.chainId !== 57073) {
      throw new Error("Liquidation only supported on Ink (chainId 57073)");
    }

    const compositions = await db
      .select()
      .from(vaultComposition)
      .where(eq(vaultComposition.vaultId, vaultId));

    if (compositions.length === 0) {
      throw new Error("Vault has no compositions");
    }

    const client = getPublicClient();
    const smartAccount = found.smartAccountAddress as Address;

    const balances = await Promise.all(
      compositions.map(async (comp) => {
        const balance = await client.readContract({
          address: comp.tokenAddress as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [smartAccount],
        });
        return { ...comp, balance: balance as bigint };
      }),
    );

    const tokensToSell = balances.filter((b) => b.balance > BigInt(0));

    if (tokensToSell.length === 0) {
      console.info("[liquidate] No tokens with balance to sell");
      return { results: [] as SellResult[] };
    }

    console.info(
      `[liquidate] Selling ${tokensToSell.length} tokens for vault ${vaultId}`,
    );

    const results: SellResult[] = await Promise.all(
      tokensToSell.map(async (token) => {
        const { orderUid, error } = await submitCowSellOrder(
          smartAccount,
          token.tokenAddress as Address,
          token.balance,
        );
        return {
          sellToken: token.tokenAddress,
          ticker: token.ticker,
          sellAmount: token.balance.toString(),
          orderUid,
          error,
        };
      }),
    );

    try {
      const now = String(Date.now());
      const dbRows = results.map((r) => ({
        id: crypto.randomUUID(),
        vaultId,
        ticker: r.ticker,
        tokenAddress: r.sellToken,
        sellAmount: r.sellAmount,
        orderUid: r.orderUid ?? null,
        status: r.orderUid ? "submitted" : "failed",
        error: r.error ?? null,
        chainId: 57073,
        createdAt: now,
      }));

      if (dbRows.length > 0) {
        await db.insert(sellOrder).values(dbRows);
      }
    } catch (err) {
      console.error("[liquidate] Failed to persist sell orders to DB:", err);
    }

    const succeeded = results.filter((r) => r.orderUid).length;
    const failed = results.length - succeeded;
    console.info(`[liquidate] Done — ${succeeded} succeeded, ${failed} failed`);

    return { results };
  },
  {
    body: t.Object({
      vaultId: t.String(),
    }),
  },
);
