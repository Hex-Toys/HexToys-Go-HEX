import {useEffect, useState} from "react";
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
import {add} from "@pulsex/jsbi";

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
    const fetchInfo = useBearStore((state) => state.fetchInfo);

    const { isConnected, address } = useAccount();
    const [title, setTitle] = useState('');
    const [currentChain, setCurrentChain] = useState('');
    const [shareChartLabels, setShareChartLabels] = useState([]);
    const [shareChartData, setShareChartData] = useState({labels: [], datasets: []});
    const [dailyChartLabels, setDailyChartLabels] = useState([]);
    const [dailyChartData, setDailyChartData] = useState({datasets: []});
    const [isLoading, setIsLoading] = useState(false);

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
            if (!hh[props.chain] || !cc[props.chain]) {
                if (!isLoading) {
                    setIsLoading(true);
                    fetchInfo(props.chain);
                }
            } else {
                processGraphData(hh[props.chain], cc[props.chain]);
            }
        }
    }, [props, hh, cc]);

    useEffect(() => {
        if (currentChain && isConnected) {
            if (hh[currentChain]) {

            }
        }
    }, [hh, cc, isConnected, address, currentChain])

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

    return (
        <div className="chain-info-container">
            <Card variant="outlined">
                <CardContent>
                    <div className="page-title">
                        {title}
                    </div>
                    <hr/>
                    <div className="part-title">
                        T-Share Daily Close Price in $USD
                    </div>
                    {shareChartLabels.length > 0 && <div className="chart-container"><Line options={chartOptions} data={shareChartData} /></div>}
                    <div className="part-title">
                        Daily HEX Payout per T-Share
                    </div>
                    {dailyChartLabels.length > 0 && <div className="chart-container"><Scatter options={dailyChartOptions} data={dailyChartData} /></div>}
                    {/*<div className="part-title">*/}
                    {/*    Daily Data*/}
                    {/*</div>*/}

                    {/*<EnhancedTable />*/}
                </CardContent>
            </Card>
        </div>
    )
}

export default HomeChainInfo;