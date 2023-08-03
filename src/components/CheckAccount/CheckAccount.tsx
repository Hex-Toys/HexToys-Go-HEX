import { useAccount, useNetwork } from 'wagmi';
import {useState, useEffect} from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { useConnectModal } from '@rainbow-me/rainbowkit';


const CheckAccount = () => {
    const {openConnectModal} = useConnectModal();
    const { isConnected, address } = useAccount();
    const [loginStatus, setLoginStatus] = useState(false);
    const { chain } = useNetwork();

    useEffect(() => {
        const isLoggedin = address && isConnected;
        setLoginStatus(isLoggedin);
    }, [address, chain, isConnected]);

    const connectWallet = () => {
        openConnectModal();
    }


    return (
        <div className="check-account-container">
            {
                !loginStatus ? (
                    <Alert
                        action={
                            <Button color="inherit" size="small" onClick={connectWallet}>
                                CONNECT
                            </Button>
                        }
                        severity="warning"
                    >
                        Please allow the HEX website to view your current account address in MetaMask.
                    </Alert>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default CheckAccount;