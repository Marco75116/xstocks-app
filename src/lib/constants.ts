import type { Address } from "viem";

export type SupportedChainId = 57073;

export type ChainConfig = {
  chainId: SupportedChainId;
  name: string;
  shortName: string;
  accountFactory: Address;
  operator: Address;
  usdc: Address;
  swapRelayer: Address;
  explorerUrl: string;
  swapProtocol: "cow";
  logo: string;
};

export const CHAIN_CONFIG: ChainConfig = {
  chainId: 57073,
  name: "Ink Mainnet",
  shortName: "Ink",
  accountFactory: "0x3B66CAf761bDF40e5174F2DF3ddBB12202F8B9a2",
  operator: "0xB351edfb846d7c26Aed130c2DE66151c1efF5236",
  usdc: "0x2D270e6886d130D724215A266106e6832161EAEd",
  swapRelayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
  explorerUrl: "https://explorer.inkonchain.com",
  swapProtocol: "cow",
  logo: "/chains/ink.svg",
};

export const CHAIN_CONFIGS: Record<SupportedChainId, ChainConfig> = {
  57073: CHAIN_CONFIG,
};

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [57073];
export const DEFAULT_CHAIN_ID: SupportedChainId = 57073;

export function isAppSupportedChain(
  chainId: number,
): chainId is SupportedChainId {
  return chainId === 57073;
}

const WALLET_CHAIN_NAMES: Record<number, string> = {
  137: "Polygon",
};

export function getWalletChainShortLabel(chainId: number): string {
  if (isAppSupportedChain(chainId)) {
    return CHAIN_CONFIGS[chainId].shortName;
  }
  return WALLET_CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;
}

export function getWalletChainDisplayName(chainId: number): string {
  if (isAppSupportedChain(chainId)) {
    return CHAIN_CONFIGS[chainId].name;
  }
  return WALLET_CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;
}

export function getChainConfig(chainId: number): ChainConfig {
  const config = CHAIN_CONFIGS[chainId as SupportedChainId];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  return config;
}

export const OPERATOR_ADDRESS =
  "0xB351edfb846d7c26Aed130c2DE66151c1efF5236" as const;
