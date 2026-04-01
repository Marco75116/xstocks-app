import { createConfig, http } from "wagmi";
import { ink, mainnet } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [ink, mainnet],
  connectors: [coinbaseWallet({ appName: "Xodds" })],
  transports: {
    [ink.id]: http(process.env.NEXT_PUBLIC_RPC_INK_HTTP),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_ETH_HTTP),
  },
});
