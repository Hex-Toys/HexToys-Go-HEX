import { useAccount, useNetwork } from 'wagmi';
import {useState, useEffect} from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import useAuth from 'hooks/useAuth';
import {currentNetwork} from "../../utils";


const CheckAccount = () => {
    const { isConnected, address } = useAccount();
    const [loginStatus, setLoginStatus] = useState(false);
    const { chain } = useNetwork();
    const { login } = useAuth();

    useEffect(() => {
        const isLoggedin = address && isConnected;
        setLoginStatus(isLoggedin);
    }, [address, chain, isConnected]);

    const connectMetaMask = () => {
        login(1);
    }


    return (
        <div className="check-account-container">
            {
                !loginStatus ? (
                    <Alert
                        action={
                            <Button color="inherit" size="small" onClick={connectMetaMask}>
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