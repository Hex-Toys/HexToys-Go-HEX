// import CustomDropdown from 'components/dropdown/CustomDropdown';
import { useEffect, useState, useContext } from 'react';
import { HashLink } from 'react-router-hash-link'
import ConnectModal from '../connectModal/ConnectModal';
import AccountModal from "components/accountModal/AccountModal";
import './topbar.scss'
import { useAccount } from 'wagmi';
import ThemeContext from 'context/ThemeContext';
import MySelect from 'components/Widgets/MySelect';
import NavButton from 'components/Widgets/NavButton';
import { useLocation } from 'react-router-dom';
import { Dropdown } from "antd";
import SearchDrop from 'components/Widgets/Search/SearchDrop';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Button from 'components/Widgets/CustomButton';
import useAuth from 'hooks/useAuth';

interface MenuType {
    menuOpen?: boolean;
    setMenuOpen(flag: boolean): void;
};
export default function Topbar({ menuOpen, setMenuOpen }: MenuType) {

    const usetheme = useTheme();
    const isMobileOrTablet = useMediaQuery(usetheme.breakpoints.down('xs'));
    
    const { theme, setTheme } = useContext(ThemeContext)

    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);


    const { address } = useAccount();
    const { logout } = useAuth();


    const [navId, setNavId] = useState('');
    const search = useLocation();
    useEffect(() => {
        const path = search.pathname.replace('/', '');
        setNavId(path);
    }, [search]);

    function connectWallet() {
        setShowConnectModal(true);
    }
    function disConnectWallet() {
        logout();
    }

    const [showSearch, setShowSearch] = useState(false);
    const [searchTxt, setSearchTxt] = useState("");
    const [searchKey, setSearchKey] = useState('');
    const searchDrop = <SearchDrop searchTxt={searchKey} />;
    
    useEffect(() => {
        var element = document.getElementById('searchExp');
        if(showSearch=== true){
            element.classList.add('show-search');
        }else{
            element.classList.remove('show-search');
        }
    }, [showSearch]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchKey(searchTxt);
        }
    }

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

    const user_option = [
        {label : <>
            <img src={'https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67'} alt="userpicture" style={{width : 18, height : 18, borderRadius : 24}}/> View Profile
            </>, url : `https://marketplace.hex.toys/profile/${address}`
        },
        {label : <><i className="fas fa-edit"></i> Edit Profile</>, url : 'https://marketplace.hex.toys/edit_profile'},
        {label : <><i className="fas fa-sign-out-alt"></i> Disconnect</>, }
    ]


    return (
        <div className={`topbar bg_${theme} ${showSearch === true ? 'expand':''}`}>
            <div className="content">
                <div className="row">
                    <div className="logo">
                        <HashLink to="/" >
                            {theme === 'dark' ? 
                                <img src="assets/logo_white.png" alt="" />:
                                <img src="assets/logo_black.png" alt="" />
                            }
                        </HashLink>
                    </div>

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
                    </div>
                </div>

                <div className="row">
                    <button className={`search_btn text_color_1_${theme}`} onClick={()=>setShowSearch(!showSearch)}><i className="fas fa-search"></i></button>
                    <div className={`search_div ${showSearch ? 'show-search':''}`}>
                    <Dropdown placement="bottom" overlay={searchDrop} trigger={isMobileOrTablet ?['click'] : searchTxt !=='' ? ['click', 'hover'] : ['contextMenu']}>
                        <div className={`search`} id = 'searchExp'>
                        <input className={`bg_${theme} text_color_1_${theme}`} type="text" placeholder="Search for collections, NFTs or users" onChange={e => setSearchTxt(e.target.value)} onKeyPress={handleKeyPress} value={searchTxt} />
                        <button className={`bg_${theme} text_color_3_${theme}`} onClick={() => {setSearchKey(searchTxt);}}><i className="fas fa-search"></i></button>
                        </div>
                    </Dropdown>
                    </div>
                </div>

                <div className="row">
                    <div className="btn_div">
                    {address ?
                       <NavButton 
                        label = {<img src={'https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67'}
                        alt="userpicture"/>}
                        isMenu
                        menuList = {user_option}
                        disconnect = {disConnectWallet}
                        />
                        :<Button label = 'Connect Wallet' onClick = {connectWallet} roundFull fillBtn/>
                    
                    }
                    <MySelect options={color_option} value={theme} onChange={setTheme} className={'my_theme_slelct'}/>
                    
                    <HashLink to="/"  className = 'icon_link'>
                        {theme === 'dark' ? 
                            <img src="assets/icons/icon_message_alrt.svg" alt="" />:
                            <img src="assets/icons/icon_message_alrt_black.svg" alt="" />
                        }
                    </HashLink>

                    <HashLink to="/" className = 'icon_link'>
                        {theme === 'dark' ? 
                            <img src="assets/icons/icon_curt.svg" alt="" />:
                            <img src="assets/icons/icon_curt_black.svg" alt="" />
                        }
                    </HashLink>
                    </div>
                </div>

                <div className={(menuOpen ? "hamburger active" : "hamburger")} onClick={() => setMenuOpen(!menuOpen)}>
                    <span className={`line1 bg_${theme}`}></span>
                    <span className={`line2 bg_${theme}`}></span>
                    <span className={`line3 bg_${theme}`}></span>
                </div>
            </div>

            <ConnectModal showConnectModal={showConnectModal} setShowConnectModal={setShowConnectModal} />
            <AccountModal showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
        </div>
    )
}
