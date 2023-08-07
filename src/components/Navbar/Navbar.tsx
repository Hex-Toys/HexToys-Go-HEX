import { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Logo from '../../assets/imgs/logo.svg';
import { Drawer } from '@material-ui/core';
import './styles.scss';
import { Link, useLocation } from 'react-router-dom';
import { useBearStore } from "../../store";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MySelect from 'components/Widgets/MySelect';
import ThemeContext from 'context/ThemeContext';
import Menu from 'components/menu/Menu';

const NavBar = () => {
    const startDate = 1575244816000;
    const [showMenu, setShowMenu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(0);
    const [remainTime, setRemainTime] = useState('');
    // @ts-ignore
    const setCurrentDay = useBearStore((state) => state.setCurrentDay);

    const [navId, setNavId] = useState('');
    const search = useLocation();

    useEffect(() => {
        const path = search.pathname.replace('/', '');
        setNavId(path);
        console.log(path);
    }, [search]);

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
            setRemainTime(hour + 'h ' + min + 'm ' + sec + 's');
            setCurrentDate(dateDiff);
            setCurrentDay(dateDiff);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])
    const { theme, setTheme } = useContext(ThemeContext)
    const color_option = [
        {label : <><i className="fas fa-moon"/> Dark</>, value : 'dark'},
        {label : <><i className="fas fa-sun"/> Light</>, value : 'light'}
    ]


    return (
        <>
        <div className={`navbar-container ${theme}`} >
            <AppBar position="static">
                <Toolbar>

                    <div className="left-menu">
                        <Link to={'/'} style={{height: '56px'}}>
                            <img src={Logo} />
                        </Link>
                        <div className="menu_list">
                            <Link to={'/'} className={`text_color_1_${theme} ${!navId ? 'active': ''}`}>
                                HEX
                            </Link>
                            <Link to={'/transfer'} className={`text_color_1_${theme} ${navId == 'transfer' ? 'active' : ''}`}>
                                Transfer
                            </Link>
                            <Link to={'/stake'} className={`text_color_1_${theme} ${navId == 'stake' ? 'active':''}`}>
                                Stake
                            </Link>
                        </div>
                        
                    </div>
                    <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'}/>
                    <div className="day-info">
                        <label className={`text_color_1_${theme}`}>{currentDate}d {remainTime}</label>
                    </div>
                    <div className="btn_div">
                        <ConnectButton />
                    </div>
                    <button className={`showMenuBtn text_color_1_${theme}`} onClick={()=>setShowMenu(!showMenu)}>
                        {!showMenu ? 
                            <i className="fas fa-bars"></i>:
                            <i className="fas fa-times"></i>
                        }
                    </button>
                    
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                Test
            </Drawer>
            
        </div>
        <Menu setMenuOpen={setShowMenu} menuOpen={showMenu}/>
        </>
    )
}
export default NavBar;