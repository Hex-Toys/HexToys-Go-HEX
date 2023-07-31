import './app.scss';
import { useEagerConnect } from "hooks/useEagerConnect";
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
function App() {
  useEagerConnect();
  return (
      <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 },
          className : 'myToast'
        }}
        
      />
    <Router>
      <Switch>
        {/* <Route exact path="/" component={} /> */}
      </Switch>
    </Router>
    </>
  );
}

export default App;
