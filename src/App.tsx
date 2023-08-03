import './app.scss';
import {BrowserRouter as Router, Switch, Route,} from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import NavBar from "./components/Navbar/Navbar";
import CheckAccount from "./components/CheckAccount/CheckAccount";
import Home from "./pages/Home/Home";
import Transfer from "./pages/Transfer/Transfer";
import Stake from "./pages/Stake/Stake";

function App() {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {duration: 3000},
                    error: {duration: 3000},
                    className: 'myToast'
                }}

            />
            <Router>
                <NavBar />
                <CheckAccount/>
                <Switch>
                     <Route exact path="/" component={Home} />
                     <Route exact path="/transfer" component={Transfer} />
                     <Route exact path="/stake" component={Stake} />
                </Switch>
            </Router>
        </>
    );
}

export default App;
