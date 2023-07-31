import { useState, useEffect } from "react"
import useAuth from 'hooks/useAuth'
import { useAccount  } from 'wagmi';

export function useEagerConnect() {
  const { isConnected } = useAccount();
  const { login } = useAuth()

  const [tried, setTried] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    login()
    setError(error)
    setTried(true)
  }, [login, error]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && isConnected) {
      setTried(true)
    }
  }, [tried, isConnected])

  return [tried, error]
}
