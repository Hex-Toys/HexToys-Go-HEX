import Grid from '@material-ui/core/Grid';
import {useEffect, useState} from "react";
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
import {useBearStore} from "../../store";
import {loadStakeInfo} from "../../utils/helper";

import "react-daterange-picker/dist/css/react-calendar.css";
import './style.scss'
import {useAccount, useNetwork} from "wagmi";
import JSBI from "@pulsex/jsbi";
import {Ue, Ve, Ee, _e, De} from '../../utils/table-helper';

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
    console.log('bonus-hearts', a,e,t, i,l);
    return {bonusHearts: i, stakeShares: l}
}

function lr(a, e, t) {
    const {bonusHearts: i, stakeShares: l} = ir(a, e, t), r = Pa(e, t), n = Aa(e);
    return {bonusHearts: i, stakeShares: l, bonusHeartsLpb: r, bonusHeartsBpb: n}
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

    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();

    // @ts-ignore
    const moment = extendMoment(originalMoment);
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakeDays, setStakeDays] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [days, setDays] = useState(null);
    const [loginStatus, setLoginStatus] = useState(false);
    const [currentChain, setCurrentChain] = useState('');
    const [shareRate, setShareRate] = useState(JSBI.fromUint32NZ(1e5));
    const [isLoading, setIsLoading] = useState(false);
    const [bonusHearts, setBonusHearts] = useState('0.000');
    const [bonusHeartsLpb, setBonusHeartsLpb] = useState('+ 0.000');
    const [bonusHeartsBpb, setBonusHeartsBpb] = useState('+ 0.000');
    const [effectiveHearts, setEffectiveHearts] = useState('0.000');
    const [heartsPerTShare, setHeartsPerTShare] = useState('0.000 HEX / T-Share');
    const [stakeShare, setStakeShare] = useState('0.000');
    const [isLoadStake, setIsLoadStake] = useState(false);

    // @ts-ignore
    const NN = useBearStore((state) => state.NN);
    // @ts-ignore
    const hh = useBearStore((state) => state.hh);
    // @ts-ignore
    const fetchInfo = useBearStore((state) => state.fetchInfo);

    useEffect(() => {
        const isLoggedin = address && isConnected;
        setLoginStatus(isLoggedin);
        if (isLoggedin) {
            console.log('chain-id:', chain.id);
            let chainName = '';
            if (chain.id == 369) {
                chainName = 'pulse-main';
                setCurrentChain('pulse-main');
            } else if (chain.id == 1) {
                chainName = 'eth-main';
                setCurrentChain('eth-main');
            } else {
                chainName = 'pulse-test';
                setCurrentChain('pulse-test');
            }

            if (!isLoadStake) {
                setIsLoadStake(true);
                fetchStakeInfo(chainName, '0xBf8fF255aD1f369929715a3290d1ef71d79f8954');
            }
        }
    }, [address, chain, isConnected]);

    useEffect(() => {
        if (currentChain) {
            if (!hh[currentChain]) {
                if (!isLoading) {
                    setIsLoading(true);
                    fetchInfo(currentChain);
                }
            }
        }
    }, [hh, currentChain]);

    useEffect(() => {
        if (currentChain) {
            setShareRate(NN[currentChain].shareRate);
        }
    }, [NN, currentChain]);

    useEffect(() => {
        let days = !stakeDays ? 0 : stakeDays;
        let amount = !stakeAmount ? JSBI.zero : stakeAmount;
        try {
            amount = pe(amount, 8);
        } catch (e) {
            console.log(e);
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
        let hpts = _e(JSBI.multiply(shareRate, ca), " HEX / T-Share");
        setHeartsPerTShare(hpts.join(''));

        let ss = De(est.stakeShares);
        console.log(ss);
        if (ss[0] == '0' && ss[1] == ".000") {
            setStakeShare("<0.001");
        } else {
            setStakeDays(ss[0] + ss[1]);
        }

    }, [stakeDays, stakeAmount])


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

    const fetchStakeInfo = async(chain, address) => {
        let data = await loadStakeInfo(chain, address);
        console.log(data);
    }

    return (
        <div className="stake-page-container">
            <div className="page-title">
                Stake
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <div className="text-group">
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                Stake Amount in Hex
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                value={stakeAmount}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <div>
                                            HEX &nbsp;
                                            <button>MAX</button>
                                        </div>
                                    </InputAdornment>
                                }
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setStakeAmount(event.target.value);
                                }}
                            />
                        </FormControl>
                    </div>

                    <div className="text-group" style={{marginTop: '30px'}}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                Stake Length in Days
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                value={stakeDays}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <div>
                                            Days

                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowCalendar}
                                            >
                                                <FaCalendarAlt/>
                                            </IconButton>
                                        </div>
                                    </InputAdornment>
                                }
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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

                    <Button variant="contained" style={{marginTop: '20px'}}>Stake</Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <div className="stake-info-container">
                        <p className="title">Stake Bonuses:</p>
                        <div className="info-item">
                            <span>Longer Pays Better:</span>
                            <span>{bonusHeartsLpb} HEX</span>
                        </div>
                        <div className="info-item">
                            <span>Bigger Pays Better:</span>
                            <span>{bonusHeartsBpb} Hearts</span>
                        </div>
                        <div className="info-item">
                            <span className="title">Total:</span>
                            <span>{bonusHearts} HEX</span>
                        </div>
                        <div className="info-item" style={{padding: 0}}>
                            <span className="title">Effective HEX:</span>
                            <span>{effectiveHearts}</span>
                        </div>

                        <div className="info-item" style={{padding: 0, marginTop: '20px'}}>
                            <span className="title">Share Price:</span>
                            <span className="title">{heartsPerTShare}</span>
                        </div>
                        <div className="info-item" style={{padding: 0}}>
                            <span className="title">Stake T-Shares:</span>
                            <span>{stakeShare}</span>
                        </div>
                    </div>
                </Grid>
            </Grid>

            {!loginStatus && <div className="disabled-container"></div>}
        </div>
    )
}

export default Stake;