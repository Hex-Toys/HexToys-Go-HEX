import Container from '@mui/material/Container';
import React, {useState} from "react";
import './style.scss';
import {useAccount} from "wagmi";
import {useActiveWeb3} from "../../hooks/useActiveWeb3";

const Transfer = () => {

    const { isConnected, address } = useAccount();
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const { account, library } = useActiveWeb3();

    const pasteClipBoard = async () => {
        try {
            let text = await navigator.clipboard.readText();
            setReceiver(text);
        } catch (e) {
            console.log(e);
        }
    }

    const setMaxAmount = () => {
        if (account) {

        }
    }

    return (
        <Container className="transfer-page-container">
            <div className="page-title">
                Tansfer
            </div>

            <div className="input-container">
                <label>From your wallet address</label>
                <div className="input-box">
                    <input type="text" value={address}/>
                </div>
            </div>

            <div className="input-container" style={{marginBottom: '64px'}}>
                <label>To recipient wallet address</label>
                <div className="input-box">
                    <input type="text" placeholder="Type wallet address here" value={receiver}/>

                    <button className="btn-paste" onClick={pasteClipBoard}><span>Paste</span></button>
                </div>
            </div>

            <div className="input-container" style={{marginBottom: '8px'}}>
                <label>Amount in HEX</label>
                <div className="input-box">
                    <input type="text" placeholder="0.000" value={amount} onChange={e => {setAmount(e.target.value)}}/>

                    <span className="span-unit">HEX</span>
                    <button className="btn-paste" onClick={setMaxAmount}><span>MAX</span></button>
                </div>
            </div>

            <div className="balance-info">
                <label>Balance: </label>
                <span>0.000 HEX</span>
            </div>

            <button className="btn-send">Send HEX</button>
        </Container>
    )
}

export default Transfer;