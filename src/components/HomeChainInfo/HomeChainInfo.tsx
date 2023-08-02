import {useEffect, useState} from "react";
import axios from "axios";
import { useAccount, useNetwork } from 'wagmi';
import JSBI from "@pulsex/jsbi";
import {oldDailyData, oldHexData, oldGlobalData} from "../../utils/constants";

const HomeChainInfo = (props) => {

    const urls = {
        'eth-main': {
            tokenDayDataUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
            globalInfoUrl: 'https://graph.ethereum.pulsechain.com/subgraphs/name/Codeakk/Hex'
        },
        'pulse-main': {
            tokenDayDataUrl: 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex',
            globalInfoUrl: 'https://graph.pulsechain.com/subgraphs/name/Codeakk/Hex'
        }
    }

    const { isConnected, address } = useAccount();
    const [currentChain, setCurrentChain] = useState('');
    const [tokenDayData, setTokenDayData] = useState([]);
    const [globalInfoData, setGlobalInfoData] = useState(oldGlobalData);
    const [dailyData, setDailyData] = useState(oldDailyData);
    const [stakeInfo, setStakeInfo] = useState({});

    const [isLoadGlobalInfo, setIsLoadGlobalInfo] = useState(false);
    const [isLoadDailyData, setIsLoadDailyData] = useState(false);
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

    useEffect(() => {
        if (props.chain && props.chain != currentChain) {
            setCurrentChain(props.chain);
            if (props.chain == 'eth-main') {
                loadInfo(0, props.chain);
            } else if (props.chain == 'pulse-main') {
                loadInfo(0, props.chain);
            }
        }
    }, [props]);

    useEffect(() => {
        if (isLoadDailyData && isLoadGlobalInfo) {
            let dkeys = Object.keys(dailyData);
            let gkeys = Object.keys(globalInfoData);
            if (dkeys.length > 0 && gkeys.length > 0) {
                console.log('process-data');
                processData();
            }
        }
    }, [dailyData, globalInfoData, isLoadDailyData, isLoadGlobalInfo]);

    const loadInfo = async (skip, chain) => {
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

            setTokenDayData(data);

            if (data.length === 1000) {
                await loadInfo(skip + 1000, chain);
            } else {
                await loadGlobalInfos(0, chain);
            }
            
        } catch (e) {
            console.log(e);
        }
    }

    const loadGlobalInfos = async (skip, chain) => {
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

            let infoData = {...globalInfoData};
            for (let i = 0; i < data.length; i ++) {
                let item = data[i];
                let hexDay = item.hexDay;
                infoData[hexDay] = item;
            }
            setGlobalInfoData(infoData);
            if (data.length === 1000) {
                await loadGlobalInfos(skip + 1000, chain);    
            } else {
                setIsLoadGlobalInfo(true);
                await loadDailyData(0, chain);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const loadDailyData = async(skip, chain) => {
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

            let infoData = {...dailyData};
            for (let i = 0; i < data.length; i ++) {
                let item = data[i];
                let curDay = item.endDay;
                infoData[curDay] = item;
            }
            setDailyData(infoData);
            if (data.length === 1000) {
                await loadDailyData(skip + 1000, chain);
            } else {
                setIsLoadDailyData(true);
                // await loadStakeInfo(chain);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const loadStakeInfo = async(chain) => {
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
            setStakeInfo(data);
        } catch (e) {
            console.log(e);
        }
    }

    const processData = () => {
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
            if (t && i && N.currentDay > 0) {
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
            const u = JSBI.fromNumber(t * Ua);
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

        console.log('finished');

        const t = [[0], [null]];
        const [i,l] = t;
        for (let r = 1; r <= h.length; r++) {
            const e = r - 1
                , t = h[e];
            if (t) {
                i.push(r);
                l.push(t);
            }
        }

        
    }

    return (
        <div>
            Home Chain Info
        </div>
    )
}

export default HomeChainInfo;