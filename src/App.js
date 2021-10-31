import logo from './logo.svg';
import WalletProvider from "./contexts/wallet";
import { Exchange } from "./components/Exchange/Exchange";
import './App.css';

function App() {
  return (
    <div className="App">
      <WalletProvider>
          <header className="App-header">
            <div className="item">
              <Exchange />
            </div>
          </header>
      </WalletProvider>
    </div>
  );
}

export default App;
