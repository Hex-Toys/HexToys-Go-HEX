import Container from '@mui/material/Container';
import React, {useState} from "react";
import './style.scss';
import {} from "wagmi";
import {useActiveWeb3} from "../../hooks/useActiveWeb3";
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { scHEXTransfer } from 'utils/contracts';
import { useContractRead } from 'context/useContractRead';

const Transfer = () => {
    const {loginStatus, chainId, library, account} = useActiveWeb3();
    const {hexBalance} = useContractRead();

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState(0.00);
    
    const pasteClipBoard = async () => {
        try {
            let text = await navigator.clipboard.readText();
            setReceiver(text);
        } catch (e) {
            console.log(e);
        }
    }

    const setMaxAmount = () => {
        if (hexBalance) {
            setAmount(hexBalance);
        }
    }

    const onTransferHandler = async() => {
        if (!loginStatus) {
            toast.error("Please connect wallet correctly!");
            return;
        }

        if (!ethers.utils.isAddress(receiver)) {
            toast.error("Reception address is not valid!");
            return;
        }

        if (amount <= 0) {
            toast.error("Transfer amount should be higher than 0");
            return;
        }

        const load_toast_id = toast.loading("Please wait for sending...");
        try {
            let bSuccess = await scHEXTransfer(chainId, library, receiver, amount);

            if (bSuccess) {
                toast.success("Transfer Success!");
            } else {
                toast.error("Transfer Failed!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Transfer Failed!");
        }
        toast.dismiss(load_toast_id);
    }

    return (
        <Container className="transfer-page-container">
            <div className="page-title">
                Tansfer
            </div>

            <div className="input-container">
                <label>From your wallet address</label>
                <div className="input-box">
                    <input type="text" value={account}/>
                </div>
            </div>

            <div className="input-container" style={{marginBottom: '64px'}}>
                <label>To recipient wallet address</label>
                <div className="input-box">
                    <input type="text" placeholder="Type wallet address here" onChange={e => {setReceiver(e.target.value)}}/>

                    <button className="btn-paste" onClick={pasteClipBoard}><span>Paste</span></button>
                </div>
            </div>

            <div className="input-container" style={{marginBottom: '8px'}}>
                <label>Amount in HEX</label>
                <div className="input-box">
                    <input type="number" placeholder="0.000" value={amount} onChange={e => {
                        // @ts-ignore
                        setAmount(e.target.value);
                    }}/>

                    <span className="span-unit">HEX</span>
                    <button className="btn-paste" onClick={setMaxAmount}><span>MAX</span></button>
                </div>
            </div>

            <div className="balance-info">
                <label>Balance: </label>
                <span>{hexBalance?.toFixed(3)} HEX</span>
            </div>

            <button className="btn-send" onClick={onTransferHandler}>Send HEX</button>
        </Container>
    )
}

export default Transfer;