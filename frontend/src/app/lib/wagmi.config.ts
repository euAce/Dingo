import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const virtual_sepolia = defineChain({
  id: 11155111,
  name: 'Virtual Sepolia',
  nativeCurrency: { name: 'VETH', symbol: 'VETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://virtual.sepolia.rpc.tenderly.co/7fe8abe1-dfe9-4839-b2e7-c76d2728a2b2'] },
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.sepolia.rpc.tenderly.co/42d85f70-0711-4ae4-9a30-e57716636ab8',
    },
  },
}) satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Dingo',
  //https://cloud.reown.com/ (i.e WalletConnect)
  projectId: '6971f194512885a1ba4b83a92e478671',
  chains: [virtual_sepolia],
});

// Infer config types
export type Config = typeof config;
