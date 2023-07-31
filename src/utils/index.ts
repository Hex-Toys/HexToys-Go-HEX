import { Contract } from '@ethersproject/contracts';

import StakingContract_ABI from 'contracts/AztecTokenStaking.json'
import IERC20Metadata_ABI from 'contracts/IERC20Metadata.json'

export const Networks = {
  Pulsechain: 369
}


export const Tokens = [
  {
    name: "PulseChain",
    symbol: "PLS",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
  },
  {
    name: "Wrapped Pulse",
    symbol: "WPLS",
    address: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png"
  },
  {
    name: "Dai Stablecoin from Ethereum",
    symbol: "DAI",
    address: "0xefd766ccb38eaf1dfd701853bfce31359239f305",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0xefD766cCb38EaF1dfd701853BFCe31359239F305.png"
  },
  {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png"
  },
  {
    name: "PulseX",
    symbol: "PLSX",
    address: "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x95B303987A60C71504D99Aa1b13B4DA07b0790ab.png"
  },
  {
    name: "USD Coin from Ethereum",
    symbol: "USDC",
    address: "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
    decimals: 6,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07.png"
  },
  {
    name: "HEX",
    symbol: "HEX",
    address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
    decimals: 8,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39.png"
  },
  {
    name: "Wrapped Ether from Ethereum",
    symbol: "WETH",
    address: "0x02dcdd04e3f455d838cd1249292c58f3b79e3c3c",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C.png"
  },
  {
    name: "Incentive",
    symbol: "INC",
    address: "0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d",
    decimals: 18,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d.png"
  },
  {
    name: "Tether USD from Ethereum",
    symbol: "USDT",
    address: "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
    decimals: 6,
    logoURI: "https://tokens.app.pulsex.com/images/tokens/0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f.png"
  },
]


export const CONTRACTS_BY_NETWORK = {
  [Networks.Pulsechain]: {
    StakingContract: {
      address: '0xA13bfC3C8A1a17549DCa6ff896501Fc5196515f0',
      abi: StakingContract_ABI,
    },
    AztecToken: {
      address: '0xe5087395862a208071A7909687a6c4Fe30458F1e',
      abi: IERC20Metadata_ABI,
    }
  }
}

export const currentNetwork = process.env.REACT_APP_NETWORK_ID;

export function getContractInfo(name, chainId = null) {
  if (!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];
  if (contracts) {
    return contracts?.[name];
  } else {
    return null;
  }
}

export function truncateWalletString(walletAddress) {
  if (!walletAddress) return walletAddress;
  const lengthStr = walletAddress.length;
  const startStr = walletAddress.substring(0, 7);
  const endStr = walletAddress.substring(lengthStr - 7, lengthStr);
  return startStr + '...' + endStr;
}

export function truncateHashString(txhash) {
  if (!txhash) return txhash;
  const lengthStr = txhash.length;
  const startStr = txhash.substring(0, 10);
  const endStr = txhash.substring(lengthStr - 10, lengthStr);
  return startStr + '...' + endStr;
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export function getContractObjWithAddress(name, chainId, provider, contractAddress) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(contractAddress, info.abi, provider);
}

// get payment curreny information
export function getCurrencyInfoFromAddress(address) {
  let filtered = Tokens.filter(token => token.address.toLowerCase() === address.toLowerCase())
  if (filtered && filtered.length > 0) {
    return filtered[0];
  } else {
    return null;
  }  
}

export function getCurrencyInfoFromSymbol(symbol) {

  let filtered = Tokens.filter(token => token.symbol.toLowerCase() === symbol.toLowerCase())
  if (filtered && filtered.length > 0) {
    return filtered[0];
  } else {
    return null;
  } 
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value : any) {
  let intValue : any = Math.floor(value);
  if (intValue < 10) {
    return '' + parseFloat(value).toPrecision(2);
  } else if (intValue < 1000) {
    return '' + intValue;
  } else if (intValue < 1000000) {
    return (intValue / 1000).toFixed(1) + 'K';
  } else if (intValue < 1000000000) {
    return (intValue / 1000000).toFixed(1) + 'M';
  } else {
    return (intValue / 1000000000).toFixed(1) + 'B';
  }
}

export const putCommas = (value) => {
  try {
    if (!value) return value
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (err) {
    return value
  }
}
