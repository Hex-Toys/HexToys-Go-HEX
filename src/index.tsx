import ReactDOM from 'react-dom';
import App from './App';
import Web3RainbowKitProvider from 'hooks/Web3RainbowKitProvider';
import ActiveWeb3Provider from 'hooks/useActiveWeb3';
import { ThemeProvider } from 'context/ThemeContext';
import reportWebVitals from "./reportWebVitals";
import ContractReadProvider from 'context/useContractRead';
import { LoadingProvider } from 'context/LoadingContext';

ReactDOM.render(
  <Web3RainbowKitProvider>
    <ThemeProvider>
      <LoadingProvider>
        <ActiveWeb3Provider>
          <ContractReadProvider>
            <App />
          </ContractReadProvider>
        </ActiveWeb3Provider>
      </LoadingProvider>
    </ThemeProvider>
  </Web3RainbowKitProvider>,
  document.getElementById('root')
);

reportWebVitals();