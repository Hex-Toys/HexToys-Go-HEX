import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Logo from '../../assets/imgs/logo.png';
import Button from '@material-ui/core/Button';
import { Drawer, IconButton } from '@material-ui/core';
import { IoMenuOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { RiBankFill } from "react-icons/ri";
import './styles.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { useBearStore } from "../../store";
import { useAccount, useNetwork } from "wagmi";
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useActiveWeb3 } from 'hooks/useActiveWeb3';

const NavBar = () => {
    const startDate = 1575244816000;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(0);
    const [remainTime, setRemainTime] = useState('');
    // @ts-ignore
    const setCurrentDay = useBearStore((state) => state.setCurrentDay);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

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

    return (
        <div className="navbar-container">
            <AppBar position="static">
                <Toolbar>
                    <div className="left-menu">
                        <Link to={'/'}>
                            <Typography color="inherit">
                                <img src={Logo} style={{ height: '34px' }} />
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
                    {/* {loginStatus && (
                        <Select
                            value={network}
                            onChange={handleChange}
                            className="network-select"
                        >
                            <MenuItem value={'pulse-main'}>PulseChain MainNet</MenuItem>
                            <MenuItem value={'eth-main'}>Ethereum MainNet</MenuItem>
                            <MenuItem value={'pulse-test'}>PulseChain TestNet V4</MenuItem>
                        </Select>
                    )}

                    {!loginStatus && <Button className="btn-connect" onClick={connectWallet}>Connect Wallet</Button>} */}

                    <ConnectButton />

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