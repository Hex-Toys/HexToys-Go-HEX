import Grid from '@material-ui/core/Grid';
import './style.scss';
import HomeChainInfo from "../../components/HomeChainInfo/HomeChainInfo";
import { useLoader } from 'context/LoadingContext';
import { useContext, useEffect, useState } from 'react';
import ThemeContext from 'context/ThemeContext';

const Home = () => {
    const { theme } = useContext(ThemeContext)
    const [setLoading] = useLoader();
    
    const [isLoading1, setIsLoading1] = useState(true);
    const [isLoading2, setIsLoading2] = useState(true);
    const [isLoading3, setIsLoading3] = useState(true);
    useEffect(() => {
        if(isLoading1 || isLoading2 || isLoading3){
            setLoading(true)
        }
        else{
            setLoading(false)
        }
    }, [isLoading1, isLoading2, isLoading3])
    
    return (
        <div className={`home-container ${theme}`}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="eth-main" setIsLoading = {setIsLoading1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="pulse-main" setIsLoading = {setIsLoading2}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="pulse-test" setIsLoading = {setIsLoading3}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home;