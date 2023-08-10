import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useActiveWeb3 } from "hooks/useActiveWeb3";
import { scGetStakingEngineInfo } from "utils/contracts";
import { StakingEngineDetail } from "utils/typs";

const ContractReadContext = createContext<any[]>([null]);

function useContractReadContext() {
  return useContext(ContractReadContext);
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export function useContractRead(): StakingEngineDetail {
  const [data, isLoaded] = useContractReadContext();
  return data;
}


export default function ContractReadProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<any>({});
  const { account, provider, chainId, loginStatus } = useActiveWeb3();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const fetchMulticall = useCallback(async () => {
    try {
      if (!loginStatus || !chainId || !provider || !account) {
        throw new Error('Invalid login status');
      }

      setIsLoaded(false);
      const stakeData = await scGetStakingEngineInfo(chainId, provider, account);
      setData(stakeData);
      setIsLoaded(true);
    } catch (error: any) {
      // console.log(error.message);
      setData({});
      setIsLoaded(true);
    }
  }, [loginStatus, chainId, provider, account]);

  useEffect(() => {
    fetchMulticall();
  }, [fetchMulticall]);

  const value = useMemo(
    () => [data, isLoaded, { setData }],
    [data, setData, isLoaded]
  );

  return (
    <ContractReadContext.Provider value={value}>
      {children}
    </ContractReadContext.Provider>
  );
}
