//

import React from 'react'
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { pulsechain } from 'wagmi/chains'

import {
  // rainbowWallet,
  walletConnectWallet,
  // trustWallet,
  metaMaskWallet,
  // ledgerWallet,
  // phantomWallet,
  // okxWallet,
  coinbaseWallet
} from '@rainbow-me/rainbowkit/wallets'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [pulsechain],
  [publicProvider()]
)

// const { connectors } = getDefaultWallets({
//   appName: 'okse-dapp',
//   projectId: process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
//   chains,
// })
const projectId = process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID'
const appName = "Aztec Token Staking";

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      // trustWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      // rainbowWallet({ projectId, chains }),
      // ledgerWallet({ projectId, chains }),
      // phantomWallet({ chains }),
      // okxWallet({ projectId, chains }),
      coinbaseWallet({ appName, chains })
    ],
  },
])

// @ts-ignore
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export default function Web3RainbowKitProvider({ children }: { children: any }): any {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
