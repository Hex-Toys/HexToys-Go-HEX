import axios from "axios";
import JSBI from "@pulsex/jsbi";
import {oldHexData} from "./constants";

const urls = {
    'eth-main': {
        tokenDayDataUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
        globalInfoUrl: 'https://graph.ethereum.pulsechain.com/subgraphs/name/Codeakk/Hex',
        title: 'Ethereum MainNet'
    },
    'pulse-main': {
        tokenDayDataUrl: 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex',
        globalInfoUrl: 'https://graph.pulsechain.com/subgraphs/name/Codeakk/Hex',
        title: 'PulseChain MainNet'
    },
    'pulse-test': {
        tokenDayDataUrl: 'https://graph.v4.testnet.pulsechain.com/subgraphs/name/pulsechain/pulsex',
        globalInfoUrl: 'https://graph.v4.testnet.pulsechain.com/subgraphs/name/Codeakk/Hex',
        title: 'PulseChain TestNet V4'
    }
}

const staticHexPrices = oldHexData.reduce((a, e) => (a[e.currentDay] = {
    hexPrice: e.priceUV2UV3,
    tsharePrice: e.tshareRateUSD,
    tshareRate: e.tshareRateHEX,
    apy: e.actualAPYRate,
    payout: e.dailyPayoutHEX,
    payoutPerTshare: e.payoutPerTshareHEX,
    totalTshares: e.totalTshares,
    lockedHeartsTotal: e.totalValueLocked
}, a), {});


export const loadHexInfo = async (skip, chain, result) => {
    try {
        let postData = {
            operationName: "allTokenDayDatas",
            query: "query allTokenDayDatas($token: String!, $first: Int!, $skip: Int!, $date: Int!) {\n" +
                "  tokenDayDatas(\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    where: {token: $token, date_gt: $date}\n" +
                "    orderBy: date\n" +
                "    orderDirection: asc\n" +
                "  ) {\n" +
                "    id\n" +
                "    date\n" +
                "    priceUSD\n" +
                "    __typename\n" +
                "  }\n" +
                "}\n",
            variables: {
                date: 1683763200,
                first: 1000,
                skip: 0,
                token: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"
            }
        }

        let res = await axios.post(urls[chain].tokenDayDataUrl, postData);
        let data = res.data.data.tokenDayDatas;

        if (data.length === 1000) {
            return await loadHexInfo(skip + 1000, chain, result.concat(data));
        } else {
            return result.concat(data);
        }

    } catch (e) {
        // console.log(e);
        return [];
    }
}

export const loadGlobalInfos = async (skip, chain, result) => {
    try {
        let postData = {
            operationName: "allGlobalInfos",
            query: "query allGlobalInfos($first: Int!, $skip: Int!, $afterDay: BigInt!) {\n" +
                "  globalInfos(\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    orderBy: hexDay\n" +
                "    orderDirection: asc\n" +
                "    where: {hexDay_gt: $afterDay}\n" +
                "  ) {\n" +
                "    id\n" +
                "    allocatedSupply\n" +
                "    totalSupply\n" +
                "    lockedHeartsTotal\n" +
                "    nextStakeSharesTotal\n" +
                "    shareRate\n" +
                "    stakePenaltyTotal\n" +
                "    stakeSharesTotal\n" +
                "    latestStakeId\n" +
                "    totalHeartsinCirculation\n" +
                "    totalMintedHearts\n" +
                "    timestamp\n" +
                "    blocknumber\n" +
                "    hexDay\n" +
                "    globalInfoCount\n" +
                "    transactionHash\n" +
                "    __typename\n" +
                "  }\n" +
                "}\n",
            variables: {
                first: 1000,
                skip: skip,
                afterDay: "1259"
            }
        }

        let res = await axios.post(urls[chain].globalInfoUrl, postData);
        let data = res.data.data.globalInfos;

        let infoData = {...result};
        for (let i = 0; i < data.length; i ++) {
            let item = data[i];
            let hexDay = item.hexDay;
            infoData[hexDay] = item;
        }
        if (data.length === 1000) {
            return await loadGlobalInfos(skip + 1000, chain, infoData);
        } else {
            return infoData;
        }
    } catch (e) {
        // console.log(e);
        return {};
    }
}

export const loadDailyData = async(skip, chain, result) => {
    try {
        let postData = {
            operationName: "allDailyData",
            query: "query allDailyData($first: Int!, $skip: Int!, $afterDay: Int!) {\n" +
                "  dailyDataUpdates(\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    orderBy: beginDay\n" +
                "    orderDirection: asc\n" +
                "    where: {beginDay_gt: $afterDay}\n" +
                "  ) {\n" +
                "    id\n" +
                "    timestamp\n" +
                "    beginDay\n" +
                "    endDay\n" +
                "    payout\n" +
                "    shares\n" +
                "    sats\n" +
                "    payoutPerTShare\n" +
                "    blockNumber\n" +
                "    lobbyEth\n" +
                "    lobbyHexAvailable\n" +
                "    lobbyHexPerEth\n" +
                "    transactionHash\n" +
                "    __typename\n" +
                "  }\n" +
                "}\n",
            variables: {
                first: 1000,
                skip: skip,
                afterDay: 1259
            }
        }

        let res = await axios.post(urls[chain].globalInfoUrl, postData);
        let data = res.data.data.dailyDataUpdates;

        let infoData = {...result};
        for (let i = 0; i < data.length; i ++) {
            let item = data[i];
            let curDay = item.endDay;
            infoData[curDay] = item;
        }
        if (data.length === 1000) {
            return await loadDailyData(skip + 1000, chain, infoData);
        } else {
            return infoData;
        }
    } catch (e) {
        // console.log(e);
        return {};
    }
}

export const loadStakeInfo = async(chain, address) => {
    try {
        let postData = {
            operationName: "allStakesAndTransfers",
            query: "query allStakesAndTransfers($first: Int!, $skip: Int!, $address: Bytes!) {\n" +
                "  transfersIn: transfers(\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    orderBy: timestamp\n" +
                "    orderDirection: asc\n" +
                "    where: {to: $address}\n" +
                "  ) {\n" +
                "    id\n" +
                "    from\n" +
                "    to\n" +
                "    value\n" +
                "    hexDay\n" +
                "    timestamp\n" +
                "    transactionHash\n" +
                "    numeralIndex\n" +
                "    __typename\n" +
                "  }\n" +
                "  transfersOut: transfers(\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    orderBy: timestamp\n" +
                "    orderDirection: asc\n" +
                "    where: {from: $address}\n" +
                "  ) {\n" +
                "    id\n" +
                "    from\n" +
                "    to\n" +
                "    value\n" +
                "    hexDay\n" +
                "    timestamp\n" +
                "    transactionHash\n" +
                "    numeralIndex\n" +
                "    __typename\n" +
                "  }\n" +
                "  stakeStarts(\n" +
                "    orderBy: timestamp\n" +
                "    orderDirection: asc\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    where: {stakerAddr: $address}\n" +
                "  ) {\n" +
                "    id\n" +
                "    stakerAddr\n" +
                "    stakeId\n" +
                "    timestamp\n" +
                "    stakedHearts\n" +
                "    stakeShares\n" +
                "    stakedDays\n" +
                "    isAutoStake\n" +
                "    stakeTShares\n" +
                "    startDay\n" +
                "    endDay\n" +
                "    blockNumber\n" +
                "    transactionHash\n" +
                "    __typename\n" +
                "  }\n" +
                "  stakeEnds(\n" +
                "    orderBy: timestamp\n" +
                "    orderDirection: asc\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    where: {stakerAddr: $address}\n" +
                "  ) {\n" +
                "    id\n" +
                "    stakerAddr\n" +
                "    stakeId\n" +
                "    payout\n" +
                "    stakedHearts\n" +
                "    stakedShares\n" +
                "    timestamp\n" +
                "    penalty\n" +
                "    servedDays\n" +
                "    prevUnlocked\n" +
                "    daysLate\n" +
                "    daysEarly\n" +
                "    blockNumber\n" +
                "    transactionHash\n" +
                "    __typename\n" +
                "  }\n" +
                "  stakeGoodAccountings(\n" +
                "    orderBy: timestamp\n" +
                "    orderDirection: asc\n" +
                "    first: $first\n" +
                "    skip: $skip\n" +
                "    where: {stakerAddr: $address}\n" +
                "  ) {\n" +
                "    id\n" +
                "    stakerAddr\n" +
                "    stakeId\n" +
                "    payout\n" +
                "    stakedHearts\n" +
                "    stakedShares\n" +
                "    timestamp\n" +
                "    penalty\n" +
                "    blockNumber\n" +
                "    transactionHash\n" +
                "    __typename\n" +
                "  }\n" +
                "}\n",
            variables: {
                first: 1000,
                skip: 0,
                address: address
            }
        }

        let res = await axios.post(urls[chain].globalInfoUrl, postData);
        let data = res.data.data;
        return data;
    } catch (e) {
        // console.log(e);
        return {};
    }
}

export const processData = (globalInfoData, dailyData, tokenDayData) => {
    const Ua = 1e15;
    const aa = 18233;
    const la = 1260;
    let dynamicHexPrices = {};
    const D = (JSBI.fromUint32NZ(32), JSBI.fromUint32NZ(100), JSBI.fromUint32NZ(1e3), JSBI.fromUint32NZ(1e4));
    const na = (JSBI.fromUint32NZ(365), JSBI.fromUint32NZ(100448995));
    const G = 351;
    const L = 350;
    const jl = (JSBI.fromUint32NZ(5 * (L - 1)), (a, e) => {
        const t = JSBI.divide(JSBI.multiply(e, JSBI.fromUint32(a.claimedBtcAddrCount)), JSBI.fromUint32NZ(27997742)),
            i = JSBI.divide(JSBI.multiply(e, JSBI.fromNumber(a.claimedSatoshisTotal)), JSBI.fromNumberNZ(910087996911001));
        return JSBI.add(t, i)
    });
    let s: any;
    let p: any[];
    let h: any[];
    let u: any;
    let k: any;
    let c: any[];


    let N = {
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
    };

    function F(a, e) {
        let t, i, l, r, n, d;
        const o = null !== e && void 0 !== e ? e : {}
            , {hexPrice: u} = o
            , s = dynamicHexPrices[a]
            , c = globalInfoData[a]
            , p = dailyData[a]
            , y = null !== u && void 0 !== u ? u : null === s || void 0 === s ? void 0 : s.hexPrice;
        if (a < la) {
            const e = staticHexPrices[a];
            return (null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && (e.lockedHeartsTotal = parseFloat("" + (null !== (t = null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && void 0 !== t ? t : 0)) / 1e10),
                e
        }
        const H = {
            hexPrice: parseFloat("" + (null !== y && void 0 !== y ? y : 0)),
            tsharePrice: parseFloat("" + (null !== y && void 0 !== y ? y : 0)) * parseFloat(null !== (i = null === c || void 0 === c ? void 0 : c.shareRate) && void 0 !== i ? i : 0) / 10,
            tshareRate: parseFloat("" + (null === c || void 0 === c ? void 0 : c.shareRate)) / 10,
            apy: 1e6 * parseFloat(null !== (l = null === p || void 0 === p ? void 0 : p.payoutPerTShare) && void 0 !== l ? l : 0) / parseFloat(null !== (r = null === c || void 0 === c ? void 0 : c.shareRate) && void 0 !== r ? r : 1),
            payout: p ? parseFloat(p.payout) / 1e8 : 0,
            payoutPerTshare: p ? parseFloat("" + p.payoutPerTShare) : 0,
            totalTshares: parseFloat(null !== (n = null === c || void 0 === c ? void 0 : c.stakeSharesTotal) && void 0 !== n ? n : 0) / 1e12,
            lockedHeartsTotal: parseFloat("" + (null !== (d = null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && void 0 !== d ? d : 0)) / 1e10
        };
        if (u) {
            dynamicHexPrices[a] = H;
        }
        return H;
    }

    function rr(a, e) {
        let t = JSBI.divide(JSBI.multiply(a.allocatedSupply, D), na);
        return e <= G && (t = JSBI.add(t, jl(a, t))), JSBI.nonZero(a.stakePenaltyTotal) && (t = JSBI.add(t, a.stakePenaltyTotal)), t
    }

    function ar(a, e) {
        return JSBI.divide(JSBI.multiply(e, JSBI.fromUint32NZ(1e5)), a)
    }

    function tr(a, e, t) {
        return JSBI.divide(JSBI.multiply(e, JSBI.fromUint32NZ(365e4)), 1 !== t ? JSBI.multiply(a, JSBI.fromUint32NZ(t)) : a)
    }

    function Y(a) {
        const {endDay: e} = a, t = F(e, null);
        Z(1, t);
        const i = JSBI.multiply(JSBI.fromNumberNZ(1e8), JSBI.fromNumber(null === t || void 0 === t ? void 0 : t.payout)),
            l = JSBI.multiply(JSBI.fromNumberNZ(1e12), JSBI.fromNumber(null === t || void 0 === t ? void 0 : t.totalTshares)),
            r = JSBI.multiply(JSBI.fromNumberNZ(1e10), JSBI.fromNumber(null === t || void 0 === t ? void 0 : t.lockedHeartsTotal));
        let n = null, d = null, o = null, u = null;
        if (JSBI.nonZero(l) && JSBI.nonZero(i) && JSBI.nonZero(r)) {
            n = JSBI.divide(JSBI.multiply(i, JSBI.fromNumberNZ(1e12)), l);
            const a = JSBI.divide(n, JSBI.fromUint32NZ(1e5));
            d = JSBI.toNumber(a) / 1e3;
            o = ar(r, i);
            u = tr(r, i, 1);
        }
        Object.freeze(i);
        Object.freeze(l);
        Object.freeze(n);
        Object.freeze(o);
        Object.freeze(u);
        c || (c = []);
        const s = {
            day: e,
            payoutTotal: i,
            stakeSharesTotal: l,
            payoutPerTShare: n,
            hexPayoutPerTShare: d,
            gain1Average: o,
            apy1Average: u
        };
        JSBI.nonZero(i) && n && JSBI.nonZero(n) && c.push(Object.freeze(s))
    }

    const Z = (a, e) => {
        const {hexPrice: t, tsharePrice: i} = e || {};
        if (N.currentDay > 0) {
            s = i;
            if (!p) p = [];
            if (!h) h = [];
            h.push(s);
            // p.push(u);
            k = !0;
        }
    };

    for (let ii = 0; ii < tokenDayData.length; ii ++) {
        let item = tokenDayData[ii];
        const t = parseFloat(item.priceUSD);
        const i = item.date / 86400 - aa;
        u = JSBI.fromNumber(t * Ua);
        F(i, {
            hexPrice: t
        });
    }

    let keys;

    keys = Object.keys(globalInfoData);
    for (let ii = 0; ii < keys.length; ii ++) {
        let item = globalInfoData[keys[ii]];
        N.shareRate = JSBI.fromNumber(parseFloat(item.shareRate));
        N.totalSupply = JSBI.fromString(item.totalSupply);
    }


    keys = Object.keys(dailyData);
    for (let ii = 0; ii < keys.length; ii ++) {
        let item = dailyData[keys[ii]];
        N.currentDay = item.endDay + 1;
        N.dailyDataCount = item.endDay;
        N.payoutTotal = rr(N, item.endDay);
        N.stakePenaltyTotal = JSBI.zero;
        Y(item);
    }

    return {h, c, N, u};
}

export const processStakeData = (tokenDayData, globalData, dailyData, stakeData, N, uu) => {
    // console.log('process-stake-data:', uu);
    const {currentDay: e} = N;
    let C = [];
    let L = [];
    let A = [];
    let g = JSBI.zero;
    const O = 354;
    const z = 14;
    const j = 700;
    let V;
    let f = g;
    const oa = JSBI.fromUint32NZ(j);
    const NN = "50499604051191931184";
    const Z = JSBI.fromUint32NZ(27997742);
    const Ha = 1e4;
    const ba = 1e21;
    const Ca = JSBI.BigInt(ba);
    const er = JSBI.fromUint32NZ(365e4);
    const X = JSBI.fromUint32NZ(1);
    let b = [];
    const S = {
        totalStaked: g,
        totalInterest: g,
        totalInterestLive: g,
        totalEquity: g,
        totalEquityLive: g,
        totalEquityLiveUsd: g,
        hasEnteredXfLobbies: !1,
        xfLobbiesReady: 0,
        dynamicHexPrices: {}

    };



    const jl = (JSBI.fromUint32NZ(5 * (350 - 1)), (a, e) => {
        const t = JSBI.divide(JSBI.multiply(e, JSBI.fromUint32(a.claimedBtcAddrCount)), Z),
            i = JSBI.divide(JSBI.multiply(e, JSBI.fromNumber(a.claimedSatoshisTotal)), JSBI.fromNumberNZ(910087996911001));
        return JSBI.add(t, i)
    });

    function Kl(a, e, t) {
        let i = JSBI.divide(JSBI.multiply(a.bigPayDayTotal, e), t);
        // @ts-ignore
        return i = JSBI.add(i, jl(a, i)), i
    }

    function ea(a, e) {
        a.bigPaySlice = e
    }

    function Jl(a, e) {
        return Kl(a, e, JSBI.fromString(NN))
    }

    function tr(a, e, t) {
        return JSBI.divide(JSBI.multiply(e, er), 1 !== t ? JSBI.multiply(a, JSBI.fromUint32NZ(t)) : a)
    }

    let stakeStarts = stakeData.stakeStarts;
    let stakeEnds = stakeData.stakeEnds;
    let data = [].concat(stakeStarts);
    data.sort((a, e) => parseInt(a.timestamp, 10) - parseInt(e.timestamp, 10));
    for (let ii = 0; ii < data.length; ii ++) {
        let a = data[ii];
        const {stakeId: t, stakedHearts: i, startDay: l, endDay: r, stakedDays: n, stakeShares: d, isAutoStake: o} = a
        try {
            N.nextStakeSharesTotal = JSBI.add(N.nextStakeSharesTotal, JSBI.fromString(d));
            N.lockedHeartsTotal = JSBI.add(N.lockedHeartsTotal, JSBI.fromString(i));
            N.latestStakeId = t;
            N.stakesActiveCount += 1;
            N.stakeSharesTotal = JSBI.add(N.stakeSharesTotal, N.nextStakeSharesTotal);
            N.nextStakeSharesTotal = g;
        } catch (e) {
            // console.log(a, e);
        }


        const s = parseInt(l, 10), c = parseInt(r, 10), p = parseInt(n, 10), y = s + p;
        const H = {
            stakeId: t,
            stakeInd: C.length,
            amount: JSBI.fromString(i),
            shares: JSBI.fromString(d),
            duration: p,
            isAutoStake: o,
            startDay: s,
            completesOnDay: y,
            lockedDay: e >= s ? s - 1 : void 0,
            unlockedDay: void 0,
            endDay: c,
            progress: -1,
            interest: g,
            interestLive: g,
            equity: JSBI.fromString(i),
            equityLive: JSBI.fromString(i),
            equityLiveUsd: g,
            equityDaily: [JSBI.fromString(i)],
            apy1: null,
            apyN: null,
            apyDaily: [],
            hasBpd: !1,
            bigPaySlice: g,
            stakeReturn: g,
            payout: g,
            cappedPenalty: g,
            penalty: g,
            servedDays: e >= s ? e - s : void 0,
            txnInProgress: !1,
            tableType: 'start'
        };

        H.hasBpd = s < O && y > O;
        H.hasBpd && (N.showBpdColumn = !0);

        for (let h = s; h < (e > c ? c : e); h++) {
            const a = h + 1, e = a - (y + z);
            if (e > 0 && e <= j) {
                let {cappedPenalty: a, equityLive: t} = H;
                if (JSBI.nonZero(a)) {
                    t = JSBI.add(t, a);
                    f = JSBI.subtract(f, a);
                }
                const i = JSBI.divide(JSBI.multiply(t, JSBI.fromUint32NZ(e)), oa);
                if (JSBI.greaterThanOrEqual(i, t)) {
                    a = t;
                    t = g;
                } else {
                    a = i;
                    t = JSBI.subtract(t, i);
                }
                f = JSBI.add(f, a);
                H.cappedPenalty = a;
                H.penalty = i;
                H.equityLive = t;
                H.equity = t;
            }
            const t = dailyData[h];
            if (h <= y && t) {
                let {stakeSharesTotal: e} = globalData[h];
                const {payout: t} = dailyData[h];
                "0" === e && ({stakeSharesTotal: e} = globalData[h + 1]);
                let i = JSBI.divide(JSBI.multiply(JSBI.fromString(t), H.shares), JSBI.fromString(e));
                if (H.shares && H.amount && H.hasBpd && h === O) {
                    const a = Jl(N, H.shares);
                    i = JSBI.add(i, a);
                    ea(H, a);
                }
                H.interestLive = JSBI.add(H.interest, i);
                H.equityLive = JSBI.add(H.equity, i);
                H.interest = H.interestLive;
                H.equity = H.equityLive;
                H.progress = Math.trunc(Math.min((a - H.startDay) / H.duration * Ha, Ha));
            }
            if (null !== uu && void 0 !== uu) {
                // console.log('calc-usd:', uu);
                H.equityLiveUsd = JSBI.divide(JSBI.multiply(H.equityLive, uu), Ca);
            }
            const i = H.equityDaily[H.equityDaily.length - 1], l = JSBI.subtract(H.equity, i);
            H.apy1 = tr(H.amount, l, 1);
            const r = JSBI.subtract(H.equity, H.amount);
            H.apyN = tr(H.amount, r, a - H.lockedDay);
            if (h > y) {
                H.apyDaily.push(0);
            } else {
                if (1257 === h || 1258 === h) {
                    H.apyDaily.push(32);
                } else {
                    H.apyDaily.push(JSBI.toNumber(H.apy1) / 100);
                    H.equityDaily.push(H.equity)
                }
            }
        }
        b[t] = H;
        C.push(H);
        if (e === s) {
            A.push(H);
        }
        S.totalStaked = JSBI.add(S.totalStaked, H.amount);
        S.totalEquity = JSBI.add(S.totalEquity, H.equity);
        S.totalEquityLive = JSBI.add(S.totalEquityLive, H.equityLive);
        if (null !== uu && void 0 !== uu) {
            S.totalEquityLiveUsd = JSBI.divide(JSBI.multiply(S.totalEquityLive, uu), Ca)
        }
        S.totalInterestLive = JSBI.add(S.totalInterestLive, H.interestLive);
    }

    const Ra = a => {
        let e, t, i = JSBI.add(JSBI.fromString(a.stakedHearts), JSBI.fromString(a.payout)), l = g;
        if (JSBI.nonZero(JSBI.fromString(a.penalty))) {
            if (JSBI.greaterThanOrEqual(JSBI.fromString(a.penalty), i)) {
                l = i;
                i = g;
            } else {
                l = JSBI.fromString(a.penalty);
                i = JSBI.subtract(i, JSBI.fromString(a.penalty));
            }
            const r = JSBI.signedRightShift(l, X);
            if (JSBI.nonZero(r)) {
                t = r;
                e = JSBI.subtract(l, t);
            }
        }
        const r = Object.assign(Object.assign({}, a), {
            splitPenaltyOrigin: t,
            splitPenalty: e,
            stakeReturn: i,
            cappedPenalty: l
        });
        return r
    }

    function F(a, e) {
        let t, i, l, r, n, d;
        const o = null !== e && void 0 !== e ? e : {}
            , {hexPrice: u} = o
            , s = S.dynamicHexPrices[a]
            , c = globalData[a]
            , p = dailyData[a]
            , y = null !== u && void 0 !== u ? u : null === s || void 0 === s ? void 0 : s.hexPrice;
        if (a < 1260) {
            const e = oldHexData[a];
            return (null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && (e.lockedHeartsTotal = parseFloat("" + (null !== (t = null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && void 0 !== t ? t : 0)) / 1e10),
                e
        }
        const H = {
            hexPrice: parseFloat("" + (null !== y && void 0 !== y ? y : 0)),
            tsharePrice: parseFloat("" + (null !== y && void 0 !== y ? y : 0)) * parseFloat(null !== (i = null === c || void 0 === c ? void 0 : c.shareRate) && void 0 !== i ? i : 0) / 10,
            tshareRate: parseFloat("" + (null === c || void 0 === c ? void 0 : c.shareRate)) / 10,
            apy: 1e6 * parseFloat(null !== (l = null === p || void 0 === p ? void 0 : p.payoutPerTShare) && void 0 !== l ? l : 0) / parseFloat(null !== (r = null === c || void 0 === c ? void 0 : c.shareRate) && void 0 !== r ? r : 1),
            payout: p ? parseFloat(p.payout) / 1e8 : 0,
            payoutPerTshare: p ? parseFloat("" + p.payoutPerTShare) : 0,
            totalTshares: parseFloat(null !== (n = null === c || void 0 === c ? void 0 : c.stakeSharesTotal) && void 0 !== n ? n : 0) / 1e12,
            lockedHeartsTotal: parseFloat("" + (null !== (d = null === c || void 0 === c ? void 0 : c.lockedHeartsTotal) && void 0 !== d ? d : 0)) / 1e10
        };
        if (u) {
            S.dynamicHexPrices[a] = H;
        }
        return H;
    }

    function ua(a, e) {
        const {currentDay: t} = N, {__typename: i, stakeId: l, servedDays: r, payout: n, penalty: d, prevUnlocked: o} = a,
            s = parseInt(r, 10), c = Object.assign({}, b[l]);
        if (null === c || void 0 === c ? void 0 : c.amount) {
            if (!o) {
                if (t === c.startDay) {
                    const a = A.indexOf(c);
                    if (a >= 0) {
                        A.splice(a, 1)
                    }
                    c.lockedDay = void 0;
                    c.unlockedDay = void 0;
                    c.servedDays = 0;
                } else {
                    c.unlockedDay = t;
                    c.servedDays = e ? s : c.duration;
                }
                c.payout = JSBI.fromString(n);
                c.penalty = JSBI.fromString(d);
                c.stakeReturn = JSBI.add(c.amount, c.payout);
                S.totalEquity = JSBI.subtract(JSBI.add(S.totalEquity, c.stakeReturn), c.equity);
                S.totalEquityLive = JSBI.subtract(JSBI.add(S.totalEquityLive, c.stakeReturn), c.equityLive);
                const {hexPrice: a} = F(c.endDay || c.startDay - 1 + c.servedDays, null);
                if (a) {
                    c.equityLiveUsd = JSBI.divide(JSBI.multiply(c.equityLive, JSBI.fromNumber(a * 1e15)), Ca)
                }
                c.equity = c.stakeReturn;
                c.equityLive = c.equity;
                c.hasBpd && t <= O && ea(c, g);
            }
            if (e) {
                // console.log('call-helper-683');
                c.endDay = c.startDay - 1 + s;
                S.totalInterest = JSBI.subtract(S.totalInterest, c.interest);
                S.totalInterestLive = JSBI.subtract(S.totalInterestLive, c.interestLive);
                S.totalEquity = JSBI.subtract(S.totalEquity, c.equity);
                S.totalEquityLive = JSBI.subtract(S.totalEquityLive, c.equityLive);
                if (null !== uu && void 0 !== uu) {
                    S.totalEquityLiveUsd = JSBI.divide(JSBI.multiply(S.totalEquityLive, uu), Ca)
                }
                S.totalStaked = JSBI.subtract(S.totalStaked, c.amount);
                if (c.cappedPenalty && JSBI.nonZero(c.cappedPenalty)) {
                    f = JSBI.subtract(f, c.cappedPenalty)
                }
                const a = C.length - 1;
                if (c.stakeInd !== a) {
                    const e = C[a];
                    e.stakeInd = c.stakeInd;
                    C[c.stakeInd] = e;
                }
                C.pop();
                delete c.stakeInd;
                c.tableType = 'end';
                L.push(c)
            }
        }
    }

    data = [].concat(stakeEnds);
    data.sort((a, e) => parseInt(a.timestamp, 10) - parseInt(e.timestamp, 10));
    for (let ii = 0; ii < data.length; ii ++) {
        let e = data[ii];
        let a = data[ii];
        if (!a.prevUnlocked) {
            a.stakeReturn || (e = Ra(a));
            const {servedDays: t, penalty: i, stakedShares: l, splitPenalty: r} = e, n = parseInt(t, 10);
            if (0 !== n || JSBI.nonZero(JSBI.fromString(i))) {
                N.stakeSharesTotal = JSBI.subtract(N.stakeSharesTotal, JSBI.fromString(l));
                if (JSBI.nonZeroDefined(r)) {
                    N.stakePenaltyTotal = JSBI.add(N.stakePenaltyTotal, JSBI.fromString(i));
                }
            } else {
                N.nextStakeSharesTotal = JSBI.subtract(N.nextStakeSharesTotal, JSBI.fromString(l));
                N.stakesPendingCount--;
            }
        }
        N.lockedHeartsTotal = JSBI.subtract(N.lockedHeartsTotal, JSBI.fromString(e.stakedHearts));
        V = !0;
        ua(e, !0);
    }

    return {C, S, L}
}