import Grid from '@material-ui/core/Grid';
import './style.scss';
import HomeChainInfo from "../../components/HomeChainInfo/HomeChainInfo";

const Home = () => {
    return (
        <div className="home-container">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <HomeChainInfo chain="eth-main"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    Part 2
                </Grid>
            </Grid>
        </div>
    )
}

export default Home;