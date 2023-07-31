import { useCallback } from 'react'
import { useConnect, useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi';
import { injectedConnector, walletConnectConnector, coinbaseWalletConnector } from "../utils/connectors"
import { toast } from 'react-hot-toast'
import { currentNetwork } from 'utils'

let connector = null;
const useAuth = () => {
  const { chain } = useNetwork();
  // const { isConnected } = useAccount();
  const { connect } = useConnect({
    onSuccess(data) {
      if (chain?.id !== parseInt(currentNetwork)) {
        switchNetwork(parseInt(currentNetwork));
      }
    }
  });

  const { disconnect } = useDisconnect();
  let { switchNetwork } = useSwitchNetwork({
    onError(error) {
      disconnect();
      toast.error("Please switch the network to Pulsechain.");
    }
  });

  const login = useCallback(async (walletId = 0) => {
    if (walletId === 1) {
      connector = injectedConnector;
    } else if (walletId === 2) {
      connector = walletConnectConnector;
    } else if (walletId === 3) {
      connector = coinbaseWalletConnector;
    } else {
      return;
    }
    connect({ connector: connector });
  }, [connect])

  const logout = useCallback(() => {
    disconnect()
  }, [disconnect])

  return { login, logout }
}

export default useAuth
