import React,{useContext} from 'react';
import { useHistory } from "react-router";

import './PopularItem.css'
import { formatNum, getCurrencyInfoFromAddress } from "utils";
import ThemeContext from 'context/ThemeContext';

const PopularItem = (props) => {
    const {item} = props;
    const history = useHistory();    
    const { theme } = useContext(ThemeContext)
    const goToItemDetail = () => {
        history.push(`/detail/${item.itemCollection}/${item.tokenId}`);
    }
    return (
        <div className="search-item" onClick={goToItemDetail}>
            <img src={item.image} alt={item.name} />
            <div className="search-item-info">
                <h4 className={`text_color_1_${theme}`}>{item.name}</h4>
                {
                    item?.auctionInfo ? 
                        (item?.auctionInfo.bids && item?.auctionInfo.bids.length > 0)  ?                            
                            <p className={`text_color_4_${theme}`}><span>Highest Bid</span> {formatNum(item?.auctionInfo.price)} {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).symbol}</p>
                            :
                            <p><span>Minimum Bid</span> {formatNum(item?.auctionInfo.price)} {getCurrencyInfoFromAddress(item.auctionInfo.tokenAdr).symbol}</p>                                             
                        :
                        item?.pairInfo ?                            
                            <p className={`text_color_4_${theme}`}><span> {formatNum(item?.pairInfo.price)} {getCurrencyInfoFromAddress(item.pairInfo.tokenAdr).symbol} </span>({item?.supply} editions)</p>                                                       
                            :
                            <p className={`text_color_4_${theme}`}><span>Not for sale</span> {item?.supply} editions </p>                                             
                                         
                }                
            </div>            
        </div>
    )
}

export default PopularItem
