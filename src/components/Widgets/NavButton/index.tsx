import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from "react-router-dom";
import ThemeContext from '../../../context/ThemeContext';

import './navButton.scss';
import clsx from 'clsx';

interface PropsType {
   disconnect?: any;
   url?: string;
   isMenu?: boolean;
   label?: any;
   isActive?: boolean;
   router?: boolean;
   external?: boolean;
   menuList?: any[];
 }


function NavButton({disconnect, url, isMenu, label, isActive, router, external, menuList}:PropsType) {
   const { theme } = useContext(ThemeContext)

   const [showSubMenu, setShowSubMenu] = useState(false); // explore subview

   const onClickMenu = ()=>{
      setShowSubMenu(!showSubMenu);
   }
   
   const handleOutsideClick = (e) => {
      setShowSubMenu(false);
    };

   const ref = useRef(null);
   useEffect(() => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handleOutsideClick(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref]);


   return (
      isMenu ? 
      <div className={clsx('menu-item', isActive ? 'active' : '')} onClick={() => onClickMenu()} ref={ref}>
         <div className={`label text_color_${theme}`}>{label}</div>
         <div className={clsx('drop_down', showSubMenu ? 'active_drop' : '')}>
            <div className={`drop_down_list left bg_${theme}`}>
               {menuList.map((d, k)=>(
                  d?.url ?
                  <a href={d?.url} className={clsx('drop_down_item', d.class)} key={k} target={'_blank'} rel="noreferrer">{d?.label}</a>:
                  <span className={clsx('drop_down_item', d.class)} onClick = {()=>{
                        disconnect()
                  }} key={k}>{d?.label}</span>
               ))}
            </div>
         </div>
      </div>:(
         router ? 
         <Link to={url} className={clsx('menu-item', isActive ? 'active' : '')} onClick={() => onClickMenu()}>
            <div className={`label text_color_${theme}`}>{label}</div>
         </Link>:
         <a className={clsx('menu-item', isActive ? 'active' : '')} href={url} target={external ? '_blank' : undefined} onClick={() => onClickMenu()} rel="noreferrer">
          <div className={`label text_color_${theme}`}>{label}</div>
        </a>
      )
      


   );
}

export default NavButton;

