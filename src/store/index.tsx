import { create } from 'zustand';
import {loadStakeInfo, loadHexInfo, loadDailyData, loadGlobalInfos, processData} from "../utils/helper";
import {oldDailyData, oldGlobalData} from "../utils/constants";
import JSBI from "@pulsex/jsbi";

export const useBearStore = create((set, get) => ({
    currentDay: 0,

    tokenDayData: {
        'eth-main': null,
        'pulse-main': null,
        'pulse-test': null
    },
    globalData: {
        'eth-main': null,
        'pulse-main': null,
        'pulse-test': null
    },
    dailyData: {
        'eth-main': null,
        'pulse-main': null,
        'pulse-test': null
    },
    hh: {
        'eth-main': null,
        'pulse-main': null,
        'pulse-test': null
    },
    cc: {
        'eth-main': null,
        'pulse-main': null,
        'pulse-test': null
    },
    NN: {
        'eth-main': {
            lockedHeartsTotal: JSBI.zero,
            nextStakeSharesTotal: JSBI.zero,
            shareRate: JSBI.fromUint32NZ(1e5),
            stakePenaltyTotal: JSBI.zero,
            dailyDataCount: 1,
            stakeSharesTotal: JSBI.zero,
            latestStakeId: "0",
            unclaimedSatoshisTotal: JSBI.zero,
            claimedSatoshisTotal: 0,
            claimedBtcAddrCount: 0,
            totalSupply: JSBI.zero,
            currentXfLobby: JSBI.zero,
            currentDay: 0,
            allocatedSupply: JSBI.zero,
            payoutTotal: JSBI.zero,
            bigPayDayTotal: JSBI.fromString("0xfae0c6a6400dadc0", 16),
            stakesPendingCount: 0,
            stakesActiveCount: 0,
            showBpdColumn: !1
        },
        'pulse-main': {
            lockedHeartsTotal: JSBI.zero,
            nextStakeSharesTotal: JSBI.zero,
            shareRate: JSBI.fromUint32NZ(1e5),
            stakePenaltyTotal: JSBI.zero,
            dailyDataCount: 1,
            stakeSharesTotal: JSBI.zero,
            latestStakeId: "0",
            unclaimedSatoshisTotal: JSBI.zero,
            claimedSatoshisTotal: 0,
            claimedBtcAddrCount: 0,
            totalSupply: JSBI.zero,
            currentXfLobby: JSBI.zero,
            currentDay: 0,
            allocatedSupply: JSBI.zero,
            payoutTotal: JSBI.zero,
            bigPayDayTotal: JSBI.fromString("0xfae0c6a6400dadc0", 16),
            stakesPendingCount: 0,
            stakesActiveCount: 0,
            showBpdColumn: !1
        },
        'pulse-test': {
            lockedHeartsTotal: JSBI.zero,
            nextStakeSharesTotal: JSBI.zero,
            shareRate: JSBI.fromUint32NZ(1e5),
            stakePenaltyTotal: JSBI.zero,
            dailyDataCount: 1,
            stakeSharesTotal: JSBI.zero,
            latestStakeId: "0",
            unclaimedSatoshisTotal: JSBI.zero,
            claimedSatoshisTotal: 0,
            claimedBtcAddrCount: 0,
            totalSupply: JSBI.zero,
            currentXfLobby: JSBI.zero,
            currentDay: 0,
            allocatedSupply: JSBI.zero,
            payoutTotal: JSBI.zero,
            bigPayDayTotal: JSBI.fromString("0xfae0c6a6400dadc0", 16),
            stakesPendingCount: 0,
            stakesActiveCount: 0,
            showBpdColumn: !1
        }
    },

    fetchInfo: async (chain) => {
        let hexData = await loadHexInfo(0, chain, []);
        let globalDatas = await loadGlobalInfos(0, chain, oldGlobalData);
        let dailyDatas = await loadDailyData(0, chain, oldDailyData);
        const {h, c, N} = processData(globalDatas, dailyDatas, hexData);

        // @ts-ignore
        set({tokenDayData: {...get().tokenDayData, [chain]: hexData}});
        // @ts-ignore
        set({globalData: {...get().globalData, [chain]: globalDatas}});
        // @ts-ignore
        set({dailyData: {...get().dailyData, [chain]: dailyDatas}});

        // @ts-ignore
        set({hh: {...get().hh, [chain]: h}});
        // @ts-ignore
        set({cc: {...get().cc, [chain]: c}});
        // @ts-ignore
        set({NN: {...get().NN, [chain]: N}});
    },

    fetchStakeInfo: async (chain, address) => {
        let stakeData = await loadStakeInfo(chain, address);
        // @ts-ignore
        let tokenDayData = get().tokenDayData[chain];
        // @ts-ignore
        let globalData = get().globalData[chain];
        // @ts-ignore
        let dailyData = get().dailyData[chain];
        // @ts-ignore
        let NN = get().NN[chain];


    },

    setCurrentDay: (day) => {
        set({currentDay: day});
    }
}))