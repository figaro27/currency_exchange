import React, { useState, useEffect, useContext } from 'react'
import { Currency } from '../../utils/constants'
import { WalletContext } from "../../contexts/wallet";

import './Exchange.css'

export const Exchange = () => {
  const { getBalance, setBalance } = useContext(WalletContext)
  const [sellCurrency, setSellCurrency] = useState(Currency.USD)
  const [buyCurrency, setBuyCurrency] = useState(Currency.EUR)
  const [sellBalance, setSellBalance] = useState(getBalance(Currency.USD))
  const [buyBalance, setBuyBalance] = useState(getBalance(Currency.EUR))
  const [buyAmount, setBuyAmount] = useState(0)
  const [sellAmount, setSellAmount] = useState(0)
  const [sliderVal, setSliderVal] = useState(0)
  const [rateObj, setRateObj] = useState({})
  const [rate, setRate] = useState(0)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetch('http://api.exchangeratesapi.io/v1/latest?access_key=5b58178d035bc7aadd5377be4c84e9f7&format=1')
      .then(response => response.json())
      .then(data => { 
        setRateObj(data.rates)
        setRate((data.rates[buyCurrency] / data.rates[sellCurrency]).toFixed(4))
      })
    setSellAmount(0)
    setBuyAmount(0)
    setSliderVal(0)
  }, [sellCurrency, buyCurrency])

  useEffect(() => {
    if(sellCurrency === buyCurrency) setError('Please select different currency')
    else if(sellAmount > sellBalance) setError('Exceeds balance')
    else setError(null)
    setSliderVal(sellAmount / sellBalance * 100)
  }, [sellCurrency, buyCurrency, sellAmount, sellBalance])

  const onSliderChange = (e) => {
    setSellAmount(sellBalance * e.target.value / 100)
    setBuyAmount(sellBalance * rate * e.target.value / 100)
    setSliderVal(e.target.value)
  }

  const onChangeSellCurrency = (e) => {
    const currency = e.target.value
    setSellCurrency(currency)
    setSellBalance(getBalance(currency))
  }

  const onChangeBuyCurrency = (e) => {
    const currency = e.target.value
    setBuyCurrency(currency)
    setBuyBalance(getBalance(currency))
  }

  const onMax = () => {
    setSellAmount(sellBalance)
    setBuyAmount(sellBalance * rate)
  }

  const onSellAmountChange = (e) => {
    setSellAmount(parseFloat(e.target.value))
    setBuyAmount(e.target.value * rate)
  }

  const onBuyAmountChange = (e) => {
    const sell_amount = e.target.value / rate
    setBuyAmount(parseFloat(e.target.value))
    setSellAmount(sell_amount)
  }
  
  const onSubmit = () => {
    const buy_balance = buyAmount + buyBalance
    setBuyBalance(buy_balance)
    setBalance(buyCurrency, buy_balance)
    setBuyAmount(0)
    const sell_balance = sellBalance - sellAmount
    setSellBalance(sell_balance)
    setBalance(sellCurrency, sell_balance)
    setSellAmount(0)
  }

  return (
    <div style={{width:'32em'}}>
      <div className="exchange__sell">
        <div className="exchange__error">
          { error ? error: ''}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{textAlign:'left'}}>
            <select value={sellCurrency} onChange={onChangeSellCurrency} className="exchange__select">
              <option value={Currency.USD}>USD</option>
              <option value={Currency.EUR}>EUR</option>
              <option value={Currency.GBP}>GBP</option>
            </select>
            <div style={{marginTop:'0.2em'}}>
              Balance: &nbsp;
              <span dangerouslySetInnerHTML={{__html: sellCurrency === Currency.USD ? `$`: sellCurrency === Currency.EUR ? `&euro;`: `&#8356;`}} /> 
              {sellBalance}
            </div>
          </div>       
          <div>
            <div>
              <input type="number" className="exchange__select" min="0" value={sellAmount} onChange={onSellAmountChange} />
              <button type="button" onClick={onMax} className="exchange__btn__max">MAX</button>
            </div>
            <input type="range" className="exchange__slider" min={0} max={100} value={sliderVal} onChange={onSliderChange}/>
          </div>
        </div>
      </div>


      <div style={{position: 'relative'}}>
        <div className="exchange__rate">
          <span dangerouslySetInnerHTML={{__html: sellCurrency === Currency.USD ? `$`: sellCurrency === Currency.EUR ? `&euro;`: `&#8356;`}} /> 
          1&nbsp;=&nbsp;
          <span dangerouslySetInnerHTML={{__html: buyCurrency === Currency.USD ? `$`: buyCurrency === Currency.EUR ? `&euro;`: `&#8356;`}} /> 
          {rate}
        </div>
      </div>
      
      <div className="exchange__buy">
        <div style={{textAlign:'left'}}>
          <select value={buyCurrency} onChange={onChangeBuyCurrency} className="exchange__select">
            <option value={Currency.USD} disabled={sellCurrency === Currency.USD}>USD</option>
            <option value={Currency.EUR} disabled={sellCurrency === Currency.EUR}>EUR</option>
            <option value={Currency.GBP} disabled={sellCurrency === Currency.GBP}>GBP</option>
          </select>
          <div style={{marginTop:'0.2em'}}>
            Balance: &nbsp;
            <span dangerouslySetInnerHTML={{__html: buyCurrency === Currency.USD ? `$`: buyCurrency === Currency.EUR ? `&euro;`: `&#8356;`}} /> 
            {buyBalance}
          </div>        
        </div>
        <div>
          <div>
            <input type="number" className="exchange__select" min="0" value={buyAmount} onChange={onBuyAmountChange} />
            <button type="button" onClick={onMax} className="exchange__btn__max">MAX</button>
          </div>
        </div>        
      </div>
      <button className="exchange__submit" onClick={onSubmit} disabled={error}>Exchange</button>
    </div>
  )
}
