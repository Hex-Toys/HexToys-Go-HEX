import React, {useEffect, useState} from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Logo from '../../assets/imgs/logo.png';
import Button from '@material-ui/core/Button';
import { Drawer, IconButton } from '@material-ui/core';
import {IoMenuOutline, IoSwapHorizontalOutline} from "react-icons/io5";
import {RiBankFill} from "react-icons/ri";
import './styles.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from 'react-router-dom';
import {useBearStore} from "../../store";
import {useAccount, useNetwork} from "wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';

const NavBar = () => {
    const { isConnected, address } = useAccount();
    const {openConnectModal} = useConnectModal();
    const { chain } = useNetwork();
    const [loginStatus, setLoginStatus] = useState(false);
    const startDate = 1575244816000;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(0);
    const [remainTime, setRemainTime] = useState('');

    const [network, setNetwork] = React.useState('eth-main');
    // @ts-ignore
    const setCurrentDay = useBearStore((state) => state.setCurrentDay);

    useEffect(() => {
        const isLoggedin = address && isConnected;
        setLoginStatus(isLoggedin);
        if (isLoggedin) {
            let chainName = '';
            if (chain.id == 369) {
                chainName = 'pulse-main';
            } else if (chain.id == 1) {
                chainName = 'eth-main';
            } else {
                chainName = 'pulse-test';
            }

            setNetwork(chainName);
        }
    }, [address, chain, isConnected])


    const handleChange = (event) => {
        setNetwork(event.target.value);
    };


    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const connectWallet = () => {
        openConnectModal();
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            let now = new Date();
            let nowTime = now.getTime();
            let dateDiff = Math.floor((nowTime - startDate) / 1000 / 3600 / 24);
            let nextDate = startDate + (dateDiff + 1) * 1000 * 3600 * 24;
            let timeDiff = nextDate - nowTime;
            let hour: string | number = Math.floor(timeDiff / 1000 / 3600);
            timeDiff = timeDiff - hour * 1000 * 3600;
            let min: string | number = Math.floor(timeDiff / 1000 / 60);
            timeDiff = timeDiff - min * 1000 * 60;
            let sec: string | number = Math.floor(timeDiff / 1000);
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            setRemainTime(hour + 'h:' + min + 'm:' + sec + 's');
            setCurrentDate(dateDiff);
            setCurrentDay(dateDiff);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])

    const goToTransfer = () => {

    }

    return(
        <div className="navbar-container">
            <AppBar position="static">
                <Toolbar>
                    <div className="left-menu">
                        <Link to={'/'}>
                            <Typography color="inherit">
                                <img src={Logo} style={{height: '34px'}}/>
                            </Typography>
                        </Link>
                        <Link to={'/transfer'}>
                            <Button color="inherit" onClick={goToTransfer}>
                                <IoSwapHorizontalOutline /> &nbsp;Transfer
                            </Button>
                        </Link>
                        <Link to={'/stake'}>
                            <Button color="inherit">
                                <RiBankFill /> &nbsp; Stake
                            </Button>
                        </Link>
                    </div>

                    <div className="day-info">
                        <p><b>Day {currentDate}</b></p>
                        <label>{remainTime}</label>
                    </div>
                    {loginStatus && (
                        <Select
                            value={network}
                            onChange={handleChange}
                            className="network-select"
                        >
                            <MenuItem value={'eth-main'}>PulseChain MainNet</MenuItem>
                            <MenuItem value={'pls-main'}>Ethereum MainNet</MenuItem>
                            <MenuItem value={'pls-test'}>PulseChain TestNet V4</MenuItem>
                        </Select>
                    )}

                    {!loginStatus && <Button className="btn-connect" onClick={connectWallet}>Connect Wallet</Button>}

                    {/*<IconButton onClick={toggleDrawer} edge="end">*/}
                    {/*    <IoMenuOutline />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                Test
            </Drawer>
        </div>
    )
}
export default NavBar;