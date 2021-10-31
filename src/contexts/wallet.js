import { useState, createContext } from "react"
import { Currency } from '../utils/constants'

export const WalletContext = createContext({
    usd: 0,
    gbp: 0,
    eur: 0,
    getBalance: () => {},
    setBalance: () => {}
});
const WalletProvider = (props) => {
    const [usd, setUsd] = useState(200);
    const [eur, setEur] = useState(150);
    const [gbp, setGbp] = useState(10);

    const getBalance = (currency) => {
      return currency === Currency.USD ? usd: currency === Currency.EUR ? eur: gbp
    }
    const setBalance = (currency, balance) => {
      return currency === Currency.USD ? setUsd(balance): currency === Currency.EUR ? setEur(balance): setGbp(balance)
    }

    return (
      <WalletContext.Provider value={{getBalance, setBalance}}>
          {props.children}
      </WalletContext.Provider>
    )
}
export default WalletProvider