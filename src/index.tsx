import ReactDOM from 'react-dom';
import App from './App';
import Web3RainbowKitProvider from 'hooks/Web3RainbowKitProvider';
import ActiveWeb3Provider from 'hooks/useActiveWeb3';
import { ThemeProvider } from 'context/ThemeContext';
import { LoadingProvider } from 'context/useLoader';
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Web3RainbowKitProvider>
    <ThemeProvider>
      <LoadingProvider>
        <ActiveWeb3Provider>
          <App />
        </ActiveWeb3Provider>
      </LoadingProvider>
    </ThemeProvider>
  </Web3RainbowKitProvider>,
  document.getElementById('root')
);

reportWebVitals();