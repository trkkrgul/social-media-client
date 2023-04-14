import { WagmiConfig, createClient, configureChains } from "wagmi";
import { getDefaultClient } from "connectkit";
import { bsc } from "wagmi/chains";

export const client = createClient(
  getDefaultClient({
    appName: "Sakai Vault Social Media",
    appIcon: "https://sakaivault.io/512.png",
    appDescription: "Sakai Vault Social Media App for Binance Smart Chain",

    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [bsc],
  })
);
