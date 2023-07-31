import "./menu.scss"
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

    const explore_option = [
        {label : "Collections", url : 'https://marketplace.hex.toys/explore-collections'},
        {label : "NFTs", url : 'https://marketplace.hex.toys/explore-items'},
        {label : "Leader Board", url : 'https://marketplace.hex.toys/leaderboard'},
        {label : "HEX TOYS", url : 'https://marketplace.hex.toys/hex-toys', class: 'specific-menu'},
        
    ]
    const create_option = [
        {label : "Single", url : 'https://marketplace.hex.toys/create-single'},
        {label : "Multiple", url : 'https://marketplace.hex.toys/create-multiple'}
    ]

    return (
        <div className={`sidebar ${menuOpen ? "active":''} bg_${theme}`}>
            <div className="menu_list" id='menuExp'>
                <NavButton 
                    label = 'Boutique' 
                    url = 'https://hextoys.co.uk/' 
                    external
                />
                <NavButton 
                    label = 'Explore'
                    isMenu
                    menuList = {explore_option}
                    isActive = {navId.indexOf('explore') >= 0}

                />
                {address &&
                    <>
                    <NavButton 
                        label = 'Hypercubes' 
                        url = 'https://marketplace.hex.toys/mysteryboxes' 
                        router
                        isActive = {navId.indexOf('mysteryboxes') >= 0}
                    />

                    <NavButton 
                        label = 'Create'
                        isMenu
                        menuList = {create_option}
                        isActive = {navId.indexOf('create') >= 0}
                    />
                    
                    <NavButton 
                        label = 'Import' 
                        url = 'https://marketplace.hex.toys/import' 
                        router
                        isActive = {navId.indexOf('import') >= 0}
                    />
                    
                    <NavButton 
                        label = 'My Items' 
                        url = {`https://marketplace.hex.toys/profile/${address}`}
                        router
                        // isActive = {navId.indexOf('profile') >= 0 && id === userAccount}
                    />
                    </>
                }
                <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'}/>
            </div>
        </div>
    )
}

