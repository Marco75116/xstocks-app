import { createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "xStocks" }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
