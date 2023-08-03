import { Contract } from '@ethersproject/contracts';

import HEX_ABI from 'contracts/HEX.json'

export const Networks = {
  Mainnet: 1,
  Pulsechain: 369,
  PulsechainV4: 943,
}

export const CONTRACTS_BY_NETWORK = {
  [Networks.Mainnet]: {
    HEX: {
      address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
      abi: HEX_ABI,
    }
  },
  [Networks.Pulsechain]: {
    HEX: {
      address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
      abi: HEX_ABI,
    }
  },
  [Networks.PulsechainV4]: {
    HEX: {
      address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
      abi: HEX_ABI,
    }
  }
}


export function getContractInfo(name, chainId) {
  
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
