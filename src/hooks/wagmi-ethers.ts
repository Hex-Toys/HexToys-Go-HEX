//

import React from 'react'
import type { PublicClient, WalletClient } from 'wagmi'
import { usePublicClient, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import type { HttpTransport } from 'viem'

// @ts-ignore
export function publicClientToProvider(publicClient: PublicClient): any {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new ethers.providers.JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new ethers.providers.FallbackProvider(providers)
  }
  return new ethers.providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}): any {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}

export function walletClientToSigner(walletClient: WalletClient): any {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}): any {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient])
}
