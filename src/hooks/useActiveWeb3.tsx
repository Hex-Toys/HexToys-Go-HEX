import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { useEthersProvider, useEthersSigner } from './wagmi-ethers'
import { Signer } from 'ethers'
import { mainnet, pulsechain, pulsechainV4 } from 'wagmi/chains'
import { Provider } from '@ethersproject/providers'

const ActiveWeb3Context = createContext<any[]>([null])

function useActiveWeb3Context() {
  return useContext(ActiveWeb3Context)
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export function useActiveWeb3(): {
  account?: any
  chainId?: number
  connector?: any
  isConnecting?: boolean
  isConnected?: boolean
  library?: Signer
  provider?: Provider
  error?: any
  switchNetwork?: any,
  loginStatus?: boolean
} {
  const [data] = useActiveWeb3Context()
  return data
}

export default function ActiveWeb3Provider({ children }: { children: ReactNode }): any {
  // @ts-ignore
  const { address, connector, isConnecting, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { error } = useConnect({ chainId: chain?.id, connector })
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const { switchNetwork } = useSwitchNetwork()


  const value = useMemo(
    () => {
      const loginStatus = address && isConnected && (chain?.id === mainnet.id || chain?.id === pulsechain.id || chain?.id === pulsechainV4.id);
      return [
        {
          account: address,
          chainId: chain?.id,
          connector,
          isConnecting,
          isConnected,
          library: signer,
          provider,
          error,
          switchNetwork,
          loginStatus,
        },
        isConnecting,
      ]
    },
    [address, chain?.id, connector, error, isConnected, isConnecting, provider, signer, switchNetwork]
  )

  return <ActiveWeb3Context.Provider value={value}>{children}</ActiveWeb3Context.Provider>
}
