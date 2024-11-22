import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Dingo',
  //https://cloud.reown.com/
  projectId: '6971f194512885a1ba4b83a92e478671',
  chains: [mainnet, sepolia],
});

// Infer config types
export type Config = typeof config;
