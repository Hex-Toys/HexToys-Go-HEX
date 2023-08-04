import Grid from '@material-ui/core/Grid';
import './style.scss';
import HomeChainInfo from "../../components/HomeChainInfo/HomeChainInfo";

const Home = () => {
    return (
        <div className="home-container">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="eth-main"/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="pulse-main"/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <HomeChainInfo chain="pulse-test"/>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home;