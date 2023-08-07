import "./menu.scss"
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavButton from "components/Widgets/NavButton";
import ThemeContext from "context/ThemeContext";
import { useAccount } from "wagmi";
import MySelect from "components/Widgets/MySelect";
type MenuType = {
    menuOpen: boolean;
    setMenuOpen(flag: boolean): void;
};

export default function Menu({ menuOpen, setMenuOpen }: MenuType) {
    
    const { theme, setTheme } = useContext(ThemeContext)

    const { address } = useAccount();
    
    const [navId, setNavId] = useState('');
    const search = useLocation();
    useEffect(() => {
        const path = search.pathname.replace('/', '');
        setNavId(path);
    }, [search]);

    const color_option = [
        {label : <><i className="fas fa-moon"/> Dark</>, value : 'dark'},
        {label : <><i className="fas fa-sun"/> Light</>, value : 'light'}
    ]
    

    return (
        <div className={`sidebar ${menuOpen ? "active":''} bg_${theme}`}>
            <div className="menu_list" id='menuExp'>
                <Link to={'/'} className={`text_color_1_${theme} ${!navId ? 'active': ''}`} onClick={()=>setMenuOpen(false)}>
                    HEX
                </Link>
                <Link to={'/transfer'} className={`text_color_1_${theme} ${navId == 'transfer' ? 'active' : ''}`}onClick={()=>setMenuOpen(false)}>
                    Transfer
                </Link>
                <Link to={'/stake'} className={`text_color_1_${theme} ${navId == 'stake' ? 'active':''}`}onClick={()=>setMenuOpen(false)}>
                    Stake
                </Link>

                
                <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'}/>
            </div>
        </div>
    )
}

