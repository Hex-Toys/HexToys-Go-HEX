import Grid from '@material-ui/core/Grid';
import { useContext, useEffect, useState } from "react";
import * as React from 'react';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { FaCalendarAlt } from "react-icons/fa";
import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import Button from '@mui/material/Button';
import { useBearStore } from "../../store";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import "react-daterange-picker/dist/css/react-calendar.css";
import './style.scss'
import JSBI from "@pulsex/jsbi";
import { Ue, Ve, Ee, _e, De, Ei, ke, Me, Pe } from '../../utils/table-helper';
import { useActiveWeb3 } from 'hooks/useActiveWeb3';
import toast from 'react-hot-toast';
import { scHEXStakeEnd, scHEXStakeGoodAccounting, scHEXStakeStart } from 'utils/contracts';
import { useContractRead } from "../../context/useContractRead";
import { Line, Scatter } from "react-chartjs-2";
import EnhancedTable, { HeadCell } from "../../components/EnhancedTable/EnhancedTable";
import ThemeContext from 'context/ThemeContext';
import { useLoader } from 'context/LoadingContext';
import useDocumentTitle from "../../utils/useDocumentTitle";

const Wl = (a, e) => {
    let t, i = 0;
    let J = (JSBI.fromUint32NZ(15e7), JSBI.fromString("15000000000000000", 10));
    let Q = JSBI.fromString("150000000000000000", 10);
    let W = JSBI.fromUint32NZ(1820);
    let zl = JSBI.fromString("273000000000000000000", 10);

    e > 1 && (i = e <= 3640 ? e - 1 : 3640);
    const l = JSBI.lessThanOrEqual(a, J) ? a : J;
    return t = JSBI.add(JSBI.multiply(Q, JSBI.fromUint32(i)), JSBI.multiply(l, W)), t = JSBI.divide(JSBI.multiply(a, t), zl), t
};

const Pa = (a, e) => {
    let t = 0;
    let W = JSBI.fromUint32NZ(1820);

    e > 1 && (t = e <= 3640 ? e - 1 : 3640);
    const i = JSBI.divide(JSBI.multiply(a, JSBI.fromUint32(t)), W);
    return i
}

const Aa = a => {
    let J = (JSBI.fromUint32NZ(15e7), JSBI.fromString("15000000000000000", 10));
    let Q = JSBI.fromString("150000000000000000", 10);

    const e = JSBI.lessThanOrEqual(a, J) ? a : J, t = JSBI.divide(JSBI.multiply(a, e), Q);
    return t
}

const Ga = a => null === a || void 0 === a;

function ir(a, e, t) {
    const i = Wl(e, t), l = JSBI.divide(JSBI.multiply(JSBI.add(e, i), JSBI.fromUint32NZ(1e5)), a);
    console.log('bonus-hearts', a, e, t, i, l);
    return { bonusHearts: i, stakeShares: l }
}

function lr(a, e, t) {
    const { bonusHearts: i, stakeShares: l } = ir(a, e, t), r = Pa(e, t), n = Aa(e);
    return { bonusHearts: i, stakeShares: l, bonusHeartsLpb: r, bonusHeartsBpb: n }
}

const pe = (a, e) => {
    let t = a.trim();
    if (Ga(t)) throw new Error("empty value");
    if (!t.match(/^-?[0-9.,]+$/)) throw new Error("invalid character");
    t = t.replace(/,/g, "");
    const i = t.indexOf(".");
    if (i >= 0) {
        if (t.indexOf(".", i + 1) >= 0) throw new Error("multiple decimal points");
        t = t.slice(0, i) + t.slice(i + 1, i + 1 + e).padEnd(e, "0")
    } else t += "".padEnd(e, "0");
    return JSBI.fromString(t, 10)
}

const Stake = () => {
    useDocumentTitle('HEX: Stake');

    const { theme } = useContext(ThemeContext)
    const [setLoading] = useLoader();
    // @ts-ignore
    const moment = extendMoment(originalMoment);
    const { hexBalance } = useContractRead();
    const [stakeAmount, setStakeAmount] = useState(0.00);
    const [stakeDays, setStakeDays] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [days, setDays] = useState(null);
    const [currentChain, setCurrentChain] = useState('');
    const [shareRate, setShareRate] = useState(JSBI.fromUint32NZ(1e5));
    const [isLoading, setIsLoading] = useState(false);
    const [bonusHearts, setBonusHearts] = useState('0.000');
    const [bonusHeartsLpb, setBonusHeartsLpb] = useState('+ 0.000');
    const [bonusHeartsBpb, setBonusHeartsBpb] = useState('+ 0.000');
    const [effectiveHearts, setEffectiveHearts] = useState('0.000');
    const [heartsPerTShare, setHeartsPerTShare] = useState('0.000');
    const [stakeShare, setStakeShare] = useState('0.000');
    const [isLoadStake, setIsLoadStake] = useState(false);
    const [shareChartLabels, setShareChartLabels] = useState([]);
    const [shareChartData, setShareChartData] = useState({ labels: [], datasets: [] });
    const [tableData, setTableData] = useState([]);
    const [htableData, setHTableData] = useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [stakeIndex, setStakeIndex] = useState(-1);

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

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#3e3e3e',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // @ts-ignore
    const NN = useBearStore((state) => state.NN);
    // @ts-ignore
    const hh = useBearStore((state) => state.hh);
    // @ts-ignore
    const cc = useBearStore((state) => state.cc);
    // @ts-ignore
    const SD = useBearStore((state) => state.SD);
    // @ts-ignore
    const SL = useBearStore((state) => state.SL);
    // @ts-ignore
    const SS = useBearStore((state) => state.SS);
    // @ts-ignore
    const fetchInfo = useBearStore((state) => state.fetchInfo);
    // @ts-ignore
    const fetchStakeInfo = useBearStore((state) => state.fetchStakeInfo);

    const { loginStatus, chainId, library, account } = useActiveWeb3();

    const headCells: readonly HeadCell[] = [
        {
            id: 'lockedDay',
            label: 'Start',
            compareValFn: Ei,
            renderValFn: a => {
                let val = a.lockedDay || a.startDay - 1;
                if (!val) return "";
                return "" + (val + 1);
            },
            className: 'is-spec'
        },
        {
            id: 'completesOnDay',
            label: 'End',
            compareValFn: Ei,
            renderValFn: (a) => {
                return "" + a;
            },
            className: ''
        },
        {
            id: 'progress',
            label: 'Progress',
            compareValFn: Ei,
            renderValFn: (a) => {
                if (a < 0) {
                    return 'Pending';
                }
                return (a / 100).toFixed(2)
            },
            className: 'is-percent'
        },
        {
            id: 'apy1',
            label: 'APY Yesterday',
            compareValFn: JSBI.compareExtended,
            renderValFn: Me,
            className: 'is-green'
        },
        {
            id: 'apyN',
            label: 'APY All',
            compareValFn: JSBI.compareExtended,
            renderValFn: Me,
            className: ''
        },
        {
            id: 'amount',
            label: 'Principal',
            compareValFn: JSBI.compare,
            renderValFn: ke,
            className: ''
        },
        {
            id: 'shares',
            label: 'T-Shares',
            compareValFn: JSBI.compare,
            renderValFn: De,
            className: ''
        },
        {
            id: 'interestLive',
            label: 'Yield',
            compareValFn: JSBI.compare,
            renderValFn: ke,
            className: ''
        },
        {
            id: 'equityLive',
            label: 'HEX',
            compareValFn: JSBI.compare,
            renderValFn: ke,
            className: ''
        },
        {
            id: 'equityLiveUsd',
            label: 'USD',
            compareValFn: JSBI.compare,
            renderValFn: Pe,
            className: ''
        },
        {
            id: 'btns',
            label: '',
            compareValFn: JSBI.compare,
            renderValFn: Pe,
            className: 'btns_col'
        },
    ];

    useEffect(() => {
        if (loginStatus) {
            console.log('chain-id:', chainId);
            let chainName = '';
            if (chainId === 369) {
                chainName = 'pulse-main';
                setCurrentChain('pulse-main');
            } else if (chainId === 1) {
                chainName = 'eth-main';
                setCurrentChain('eth-main');
            } else if (chainId === 943) {
                chainName = 'pulse-test';
                setCurrentChain('pulse-test');
            } else {
                return;
            }
        }
    }, [isLoadStake, chainId, loginStatus]);

    useEffect(() => {
        if (currentChain) {
            if (!hh[currentChain]) {
                if (!isLoading) {
                    setIsLoading(true);
                    fetchInfo(currentChain);
                }
            } else {
                processGraphData(hh[currentChain], cc[currentChain]);
                if (!isLoadStake) {
                    setIsLoadStake(true);
                    // fetchStakeInfo(currentChain, '0xBf8fF255aD1f369929715a3290d1ef71d79f8954');
                    fetchStakeInfo(currentChain, account);
                }
            }
            setLoading(false)
        }
    }, [hh, currentChain, isLoading, fetchInfo]);

    useEffect(() => {
        if (currentChain && SD[currentChain]) {
            setTableData(SD[currentChain])
        }
        if (currentChain && SL[currentChain]) {
            setHTableData(SL[currentChain])
        }
    }, [currentChain, SD, SS, SL])

    useEffect(() => {
        if (currentChain) {
            setShareRate(NN[currentChain].shareRate);
        }
    }, [NN, currentChain]);

    useEffect(() => {
        let days = !stakeDays ? 0 : stakeDays;
        let amount = !stakeAmount ? JSBI.zero : JSBI.multiply(JSBI.fromNumber(stakeAmount), JSBI.fromNumber(1e8));
        try {
            amount = pe(amount, 8);
        } catch (e) {
            // console.log(e);
        }
        let est = lr(shareRate, amount, days);
        console.log(est);
        let bh = Ve(est.bonusHearts);
        let lpb = Ee(est.bonusHeartsLpb);
        let bpb = Ee(est.bonusHeartsBpb);
        //@ts-ignore
        let eh = Ve(JSBI.add(amount, est.bonusHearts));
        setBonusHearts(bh[0] + bh[1]);
        setBonusHeartsLpb(lpb[0] + lpb[1]);
        setBonusHeartsBpb(bpb[0] + bpb[1]);
        setEffectiveHearts(eh[0] + eh[1]);

        let ca = (JSBI.fromNumberNZ(1e13), JSBI.fromNumberNZ(1e7));
        let hpts = _e(JSBI.multiply(shareRate, ca), "");
        setHeartsPerTShare(hpts.join(''));

        let ss = De(est.stakeShares);
        console.log(ss);
        if (ss[0] === '0' && ss[1] === ".000") {
            setStakeShare("<0.001");
        } else {
            setStakeShare(ss[0] + ss[1]);
        }

    }, [stakeDays, stakeAmount, shareRate])

    const processGraphData = (h, c) => {
        const t = [[0], [null]];
        const [i, l] = t;
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
    }


    const handleClose = () => setOpenModal(false);

    const handleClickShowCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    const onSelectDays = (value, states) => {
        console.log(value, states);
        setDays(value);
    }

    const onSelectDaysStart = (value) => {
        console.log(value);
        let today = moment();
        let range = moment.range(moment(today.clone().format('YYYY-MM-DD')), value.format('YYYY-MM-DD'));
        console.log(range);
        setDays(range);
        setStakeDays(value.diff(today, 'days'));
    }

    const onStakeHandler = async () => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (stakeAmount <= 0) {
            toast.error("Stake amount should be higher than 0");
            return;
        }

        if (stakeDays <= 0) {
            toast.error("Stake days should be longer than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Staking...");
        try {
            let bSuccess = await scHEXStakeStart(chainId, library, stakeAmount, stakeDays);

            if (bSuccess) {
                toast.success("Staking Success!");
            } else {
                toast.error("Staking Failed!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Staking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const confirmEndStake = async (stakeIndex, stakeIdParam) => {
        setStakeIndex(stakeIndex);
        setOpenModal(true);
    }

    const onEndStakeHandler = async (stakeIndex: number, stakeIdParam: number) => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        const load_toast_id = toast.loading("Please wait for End Staking...");
        try {
            let bSuccess = await scHEXStakeEnd(chainId, library, stakeIndex, stakeIdParam);

            if (bSuccess) {
                toast.success("End Staking Success!");
            } else {
                toast.error("End Staking Failed!");
            }
        } catch (error) {
            console.error(error);
            toast.error("End Staking Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const onStakeGoodAccountinigHandler = async (stakeIndex: number, stakeIdParam: number) => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        const load_toast_id = toast.loading("Please wait for Stake Good Accounting...");
        try {
            let bSuccess = await scHEXStakeGoodAccounting(chainId, library, account, stakeIndex, stakeIdParam);

            if (bSuccess) {
                toast.success("Stake Good Accounting Success!");
            } else {
                toast.error("Stake Good Accounting Failed!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Stake Good Accounting Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    const setMaxAmount = () => {
        if (hexBalance) {
            setStakeAmount(hexBalance);
        }
    }

    return (
        <Container className={`stake-page-container ${theme}`}>
            <div className="content">
                <div className={`page-title text_color_1_${theme}`}>
                    Stake
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <div className={`text-group ${theme}`}>
                            <FormControl variant="standard">
                                <InputLabel className={`text_color_1_${theme}`} htmlFor="input-with-icon-adornment">
                                    Stake Amount in Hex
                                </InputLabel>
                                <Input
                                    id="input-with-icon-adornment"
                                    value={stakeAmount}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <div className="adornment-box">
                                                HEX &nbsp;
                                                <button className="btn-max" onClick={setMaxAmount}><span>MAX</span></button>
                                            </div>
                                        </InputAdornment>
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        // @ts-ignore
                                        setStakeAmount(event.target.value);
                                    }}
                                />
                            </FormControl>
                        </div>

                        <div className="balance-info">
                            <label>Balance: </label>
                            <span>{hexBalance?.toFixed(3)} HEX</span>
                        </div>

                        <div className={`text-group ${theme}`} style={{ marginTop: '32px' }}>
                            <FormControl variant="standard">
                                <InputLabel htmlFor="input-with-icon-adornment">
                                    Stake Length in Days
                                </InputLabel>
                                <Input
                                    id="input-with-icon-adornment"
                                    value={stakeDays}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <div className="adornment-box">
                                                Days

                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowCalendar}
                                                >
                                                    <FaCalendarAlt />
                                                </IconButton>
                                            </div>
                                        </InputAdornment>
                                    }
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        // @ts-ignore
                                        setStakeDays(event.target.value);
                                        let today = moment();
                                        let range = moment.range(today.clone(), today.clone().add(event.target.value, 'days'));
                                        setDays(range);
                                    }}
                                />
                            </FormControl>
                        </div>

                        <div>
                            {showCalendar && <DateRangePicker
                                onSelect={onSelectDays}
                                onSelectStart={onSelectDaysStart}
                                singleDateRange={true}
                                value={days}
                                minimumDate={new Date()}
                            />}
                        </div>

                        <Button variant="contained" style={{ marginTop: '56px' }} onClick={onStakeHandler} className="btn-send">Stake</Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <div className={`stake-info-container ${theme}`}>
                            <p className={`title text_color_1_${theme}`}>Stake Bonuses:</p>
                            <div className="info-item">
                                <span className={`text_color_4_${theme}`}>Longer Pays Better:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{bonusHeartsLpb}</label> HEX</span>
                            </div>
                            <div className="info-item">
                                <span className={`text_color_4_${theme}`}>Bigger Pays Better:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{bonusHeartsBpb}</label> Hearts</span>
                            </div>
                            <div className="info-item">
                                <span className={`text_color_4_${theme}`}>Total:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{bonusHearts}</label> HEX</span>
                            </div>
                            <div className="info-item" style={{ marginTop: '40px' }}>
                                <span className={`text_color_4_${theme}`}>Effective HEX:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{effectiveHearts}</label> HEX</span>
                            </div>

                            <div className="info-item" style={{ marginTop: '40px' }}>
                                <span className={`text_color_4_${theme}`}>Share Price:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{heartsPerTShare}</label> HEX <label> / T-Share</label></span>
                            </div>
                            <div className="info-item">
                                <span className={`text_color_4_${theme}`}>Stake T-Shares:</span>
                                <span className={`text_color_4_${theme}`}><label className={`text_color_1_${theme}`}>{stakeShare}</label> HEX</span>
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <div className={`page-title text_color_1_${theme}`} style={{ marginTop: '56px' }}>
                    T-Share Daily Close Price in $USD
                </div>
                {shareChartLabels.length > 0 && <div className={`chart-container ${theme}`}><Line options={chartOptions} data={shareChartData} /></div>}

                <div className={`page-title text_color_1_${theme}`} style={{ marginTop: '56px' }}>
                    Active Stakes
                </div>

                {tableData.length > 0 && <EnhancedTable headCells={headCells} rows={tableData} orderBy={'lockedDay'} onEndStake={confirmEndStake} />}

                <div className={`page-title text_color_1_${theme}`} style={{ marginTop: '56px' }}>
                    Stake History
                </div>

                {htableData.length > 0 && <EnhancedTable headCells={headCells} rows={htableData} orderBy={'lockedDay'} />}

                {!loginStatus && <div className="disabled-container"></div>}
            </div>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={"end-stake-modal"}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirm End-Stake
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to cancel this pending stake?
                    </Typography>
                    <div className={"modal-actions"}>
                        <button onClick={handleClose}>Cancel</button>
                        <button onClick={() => {onEndStakeHandler(stakeIndex, 1)}}>End Stake</button>
                    </div>
                </Box>
            </Modal>
        </Container>
    )
}

export default Stake;