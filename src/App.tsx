import './app.scss';
import {BrowserRouter as Router, Switch, Route,} from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import NavBar from "./components/Navbar/Navbar";
import CheckAccount from "./components/CheckAccount/CheckAccount";
import Home from "./pages/Home/Home";

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
            <NavBar />
            <CheckAccount/>
            <Router>
                <Switch>
                     <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        </>
    );
}

export default App;
