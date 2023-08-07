import Container from '@mui/material/Container';
import React, {useEffect, useState} from "react";
import './style.scss';
import {} from "wagmi";
import {useActiveWeb3} from "../../hooks/useActiveWeb3";
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { scHEXTransfer } from 'utils/contracts';
import { useContractRead } from 'context/useContractRead';
import {loadStakeInfo} from "../../utils/helper";
import JSBI from "@pulsex/jsbi";
import EnhancedTable, {HeadCell} from "../../components/EnhancedTable/EnhancedTable";
import {De, Ei, ke, Me, Ot, Re, Xa, Le, Te} from "../../utils/table-helper";

const Transfer = () => {
    const {loginStatus, chainId, library, account} = useActiveWeb3();
    const {hexBalance} = useContractRead();

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState(0.00);
    const [isLoadStake, setIsLoadStake] = useState(false);
    const [tableData, setTableData] = useState([]);

    const headCells: readonly HeadCell[] = [
        {
            id: 'timestamp',
            label: 'Day',
            compareValFn: Ei,
            renderValFn: Xa,
            className: ''
        },
        {
            id: 'type',
            label: 'Type',
            compareValFn: Ei,
            renderValFn: (a) => {
                let typeDescs = ["Minted by", "Burned by", "Received from", "Sent to"];
                return typeDescs[a];
            },
            className: ''
        },
        {
            id: 'detail',
            label: 'Address',
            compareValFn: (a, e) => a.ethAddr ? e.ethAddr ? a.ethAddr.localeCompare(e.ethAddr) : 1 : e.ethAddr ? -1 : a.type - e.type,
            renderValFn: (a) => {
                let detailTypeDesc = ["Contract", "Contract (Transform)", "Contract (Claim)", "Contract (Stake)"];
                if (a.ethAddr) {
                    return Le(a.ethAddr);
                } else {
                    return detailTypeDesc[a.type];
                }
            },
            className: ''
        },
        {
            id: 'amount',
            label: 'Amount',
            compareValFn: JSBI.compare,
            renderValFn: Te,
            className: 'is-green'
        },
        {
            id: 'balance',
            label: 'Balance',
            compareValFn: JSBI.compare,
            renderValFn: ke,
            className: ''
        }
    ];

    useEffect(() => {
        if (loginStatus) {
            let chainName = '';
            if (chainId === 369) {
                chainName = 'pulse-main';
            } else if (chainId === 1) {
                chainName = 'eth-main';
            } else if (chainId === 943){
                chainName = 'pulse-test';
            } else {
                return;
            }

            if (!isLoadStake) {
                setIsLoadStake(true);
                // fetchStakeInfo(chainName, '0xBf8fF255aD1f369929715a3290d1ef71d79f8954'.toLowerCase());
                fetchStakeInfo(chainName, account.toLowerCase());
            }
        }
    }, [loginStatus, chainId, account]);

    const fetchStakeInfo = async(chain, address) => {
        let stakeData = await loadStakeInfo(chain, address);
        let data = [].concat(stakeData.transfersIn).concat(stakeData.transfersOut);
        data.sort((a, e) => parseInt(a.timestamp, 10) - parseInt(e.timestamp, 10));
        const Ol = "0x0000000000000000000000000000000000000000";
        let D = [];

        const sa = (a, e, t, i, l) => {
            const r = {
                evtId: e,
                timestamp: a,
                type: i,
                amount: 0 !== (1 & i) ? JSBI.asNegZero(t) : t,
                balance:JSBI.fromNumber( hexBalance),
                detail: {ethAddr: l, type: 3}
            };
            D.unshift(r)
        }

        for (let ii = 0; ii < data.length; ii ++) {
            let item = data[ii];
            const {from: l, to: r, value: n, timestamp: d} = item;
            const o = parseInt(d, 10);
            const u = JSBI.fromString(n);

            if (item.to == address) {
                if (item.from && item.from !== Ol) {
                    sa(o, 1, u, 2, l)
                } else {
                    sa(o, 1, u, 0, null);
                }
            }
            if (item.from == address) {
                if (item.to && item.to !== Ol) {
                    sa(o, 1, u, 3, l);
                } else {
                    sa(o, 1, u, 1, null);
                }
            }
        }

        setTableData(D);
    }
    
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
                    <input type="text" defaultValue={account}/>
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

            <div className="page-title" style={{marginTop: '96px'}}>
                Transfer History
            </div>

            {tableData.length > 0 && <EnhancedTable headCells={headCells} rows={tableData} orderBy={'timestamp'}/>}
        </Container>
    )
}

export default Transfer;