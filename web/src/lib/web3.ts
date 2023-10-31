import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

export const chains = [sepolia]

export const { publicClient, webSocketPublicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: () => ({
      http: 'https://rpc.ankr.com/eth_sepolia',
    }),
  }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Farcaster Registration',
  projectId: 'd6c989fb5e87a19a4c3c14412d5a7672',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
