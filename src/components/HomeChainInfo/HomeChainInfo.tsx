import {useContext, useEffect, useState} from "react";
import { useAccount, useNetwork } from 'wagmi';
import {oldDailyData, oldHexData, oldGlobalData} from "../../utils/constants";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import './style.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useBearStore} from "../../store";
import {Ei, Ot, ke, De, Re, Me, Ve} from '../../utils/table-helper';
import EnhancedTable, {HeadCell} from "../EnhancedTable/EnhancedTable";
import JSBI, {add} from "@pulsex/jsbi";
import Grid from "@material-ui/core/Grid";
import {useContractRead} from "../../context/useContractRead";
import ThemeContext from "context/ThemeContext";
import {useActiveWeb3} from "../../hooks/useActiveWeb3";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HomeChainInfo = (props) => {

    const { theme } = useContext(ThemeContext)

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

    // @ts-ignore
    const hh = useBearStore((state) => state.hh);
    // @ts-ignore
    const cc = useBearStore((state) => state.cc);
    // @ts-ignore
    const N = useBearStore((state) => state.NN);
    // @ts-ignore
    const S = useBearStore((state) => state.SS);
    // @ts-ignore
    const SD = useBearStore((state) => state.SD);
    // @ts-ignore
    const fetchInfo = useBearStore((state) => state.fetchInfo);
    // @ts-ignore
    const fetchStakeInfo = useBearStore((state) => state.fetchStakeInfo);

    const { isConnected, address } = useAccount();
    const [title, setTitle] = useState('');
    const [currentChain, setCurrentChain] = useState('');
    const [shareChartLabels, setShareChartLabels] = useState([]);
    const [shareChartData, setShareChartData] = useState({labels: [], datasets: []});
    const [dailyChartLabels, setDailyChartLabels] = useState([]);
    const [dailyChartData, setDailyChartData] = useState({datasets: []});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchStake, setIsFetchStake] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [hexInfoData, setHexInfoData] = useState({
        currentDay: 3,
        totalSupply: JSBI.zero
    });
    const [stakeInfoData, setStakeInfoData] = useState({
        totalStaked: JSBI.zero,
        totalInterest: JSBI.zero,
        totalInterestLive:JSBI.zero,
        totalEquity: JSBI.zero,
        totalEquityLive: JSBI.zero,
        totalEquityLiveUsd: JSBI.zero,
        hasEnteredXfLobbies: !1,
        xfLobbiesReady: 0,
    });
    const [balance, setBalance] = useState(0);
    const {hexBalance} = useContractRead();
    const { loginStatus, account, chainId } = useActiveWeb3();

    const headCells: readonly HeadCell[] = [
        {
            id: 'day',
            label: 'Day',
            compareValFn: Ei,
            renderValFn: Ot,
            className: ''
        },
        {
            id: 'payoutTotal',
            label: 'Day Payout Total',
            compareValFn: JSBI.compare,
            renderValFn: ke,
            className: ''
        },
        {
            id: 'stakeSharesTotal',
            label: 'T-Shares Total',
            compareValFn: JSBI.compare,
            renderValFn: De,
            className: ''
        },
        {
            id: 'payoutPerTShare',
            label: 'Payout Per T-Share',
            compareValFn: JSBI.compareExtended,
            renderValFn: ke,
            className: ''
        },
        {
            id: 'gain1Average',
            label: '% Gain',
            compareValFn: JSBI.compareExtended,
            renderValFn: Re,
            className: 'is-green is-percent'
        },
        {
            id: 'apy1Average',
            label: '% APY',
            compareValFn: JSBI.compareExtended,
            renderValFn: Me,
            className: 'is-percent'
        }
    ];

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const dailyChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            }
        },
    };

    useEffect(() => {
        if (props.chain) {
            setTitle(urls[props.chain].title);
            setCurrentChain(props.chain);
            if (!hh[props.chain] || !cc[props.chain]) {
                if (!isLoading) {
                    setIsLoading(true);
                    fetchInfo(props.chain);
                    
                }
            } else {
                processGraphData(hh[props.chain], cc[props.chain]);
                setTableData(cc[props.chain]);
            }
        }
        
    }, [props, hh, cc]);

    useEffect(() => {
        if (currentChain) {
            if (N[currentChain]) {
                setHexInfoData(N[props.chain]);
            }
            if (S[currentChain]) {
                setStakeInfoData(S[props.chain]);
            }
        }
    }, [currentChain, N, S])

    useEffect(() => {
        if (loginStatus && account && currentChain) {
            console.log('is-logged-in:', isConnected, account, currentChain, loginStatus);
            let name = '';
            if (chainId === 369) {
                name = 'pulse-main';
            } else if (chainId === 1) {
                name = 'eth-main';
            } else if (chainId === 943) {
                name = 'pulse-test';
            } else {
                return;
            }

            if (currentChain == name) {
                setIsLoggedIn(true);
                if (!SD[currentChain] && hh[currentChain]) {
                    if (!isFetchStake) {
                        setIsFetchStake(true);
                        // fetchStakeInfo(currentChain, '0xBf8fF255aD1f369929715a3290d1ef71d79f8954'.toLowerCase());
                        fetchStakeInfo(currentChain, account);
                    }
                }
            } else {
                setIsLoggedIn(false);
            }
        }
    }, [loginStatus, account, SD, currentChain, hh, chainId])

    useEffect(() => {
        if(tableData.length !== 0 && hexInfoData.currentDay !== 3){
            props.setIsLoading(false)
        }
    }, [tableData, hexInfoData.currentDay])

    useEffect(() => {
        setBalance(hexBalance);
    }, [hexBalance])

    const processGraphData = (h, c) => {

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

        setShareChartData({
            labels: i,
            datasets: [{
                label: 'T-Share Daily Close Price',
                data: l,
                borderColor: '#5356FB',
                backgroundColor: '#5356FB'
            }]
        });
        setShareChartLabels(i);

        let labels = [];
        let data = [];

        for (let i = 0; i < c.length; i ++) {
            labels.push(c[i].day);
            data.push({
                x: c[i].day,
                y: c[i].hexPayoutPerTShare
            });
        }

        setDailyChartData({
            datasets: [{
                label: 'Daily HEX Payout per T-Share',
                data: data,
                borderColor: 'rgb(255, 32, 255)',
                backgroundColor: 'rgb(192, 0, 192)'
            }]
        });
        setDailyChartLabels(labels);
    }

    const FormatMixedHex = (a) => {
        let data = Ve(a);
        // console.log('format-mixed-hex:', data);
        return data.join('');
    }

    return (
        <div className="chain-info-container">
            <Card variant="outlined">
                <CardContent>
                    <div className={`page-title text_color_1_${theme}`}>
                        {title}
                    </div>
                    <hr/>
                    <div className={`part-title text_color_1_${theme}`}>
                        HEX
                    </div>
                    <div className={`card-box border_${theme}`}>
                        <Grid container>
                            <Grid item xs={7}>
                                <span className={`text_color_4_${theme}`}>Current Day:</span>
                            </Grid>
                            <Grid item xs={5}>
                                <label className={`is-green text_color_1_${theme}`}>{hexInfoData.currentDay}</label>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: '12px'}}>
                            <Grid item xs={7}>
                                <span className={`text_color_4_${theme}`}>Total Supply of HEX:</span>
                            </Grid>
                            <Grid item xs={5}>
                                <label className={`text_color_1_${theme}`}>{FormatMixedHex(hexInfoData.totalSupply)}</label>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`card-box border_${theme}`} style={{marginTop: '16px'}}>
                        <Grid container>
                            <Grid item xs={7}>
                                <span className={`text_color_4_${theme}`}>Total Staked:</span>
                            </Grid>
                            <Grid item xs={5}>
                                <label className={`text_color_1_${theme}`}>{!isLoggedIn ? '--' : FormatMixedHex(stakeInfoData.totalStaked)}</label>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7}>
                                <span className={`text_color_4_${theme}`}>Yield Due:</span>
                            </Grid>
                            <Grid item xs={5}>
                                <label className={`text_color_1_${theme}`}>{!isLoggedIn ? '--' : FormatMixedHex(stakeInfoData.totalInterestLive)}</label>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7}>
                                <span className={`text_color_4_${theme}`}>Not Staked:</span>
                            </Grid>
                            <Grid item xs={5}>
                                <label className={`text_color_1_${theme}`}>{!isLoggedIn ? '--' : balance?.toFixed(3) + ' HEX'}</label>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`part-title text_color_1_${theme}`}>
                        T-Share Daily Close Price in $USD
                    </div>
                    {shareChartLabels.length > 0 && <div className={`chart-container border_${theme}`}><Line options={chartOptions} data={shareChartData} /></div>}
                    <div className={`part-title text_color_1_${theme}`}>
                        Daily HEX Payout per T-Share
                    </div>
                    {dailyChartLabels.length > 0 && <div className={`chart-container border_${theme}`}><Scatter options={dailyChartOptions} data={dailyChartData} /></div>}
                    <div className={`part-title text_color_1_${theme}`}>
                        Daily Data
                    </div>

                    {tableData.length > 0 && <EnhancedTable headCells={headCells} rows={tableData} orderBy={'day'}/>}
                </CardContent>
            </Card>
        </div>
    )
}

export default HomeChainInfo;