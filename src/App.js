// src/App.js
import './App.css'
import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn/SignIn';
import PopUp from './components/PopUp/PopUp';
import anchorwatchLogo from './assets/anchorwatch-logo.png';
import eyeIcon from './assets/eye-icon.png';
import QuickActions from './components/QuickActions/QuickActions';
import slantedBitcoinIcon from './assets/slanted-bitcoin-icon.png';
import Holdings from './components/Holdings/Holdings';
import Transactions from './components/Transactions/Transactions';

const App = () => {
  const [ signedIn, setSignedIn ] = useState(false);
  const [ loginPopUpOpen, setLoginPopUpOpen ] = useState(false);
  const [ btcPopUpOpen, setBTCPopUpOpen ] = useState(false);
  const [ address, setAddress ] = useState(null);
  const [ addressDetails, setAddressDetails ] = useState();
  const [ btcPrice, setBTCPrice ] = useState();
  const [ fullAddressHistory, setFullAddressHistory ] = useState();

  const fetchBTCAddress = async () => {
    const response = await fetch(`/.netlify/functions/api/address/${window.location.href.slice(-1)}`);
    if (response.ok) {
      const result = await response.text();
      setAddress(result);
    }
  } 

  const fetchBTCAddressDetails = async () => {
    const response = await fetch(`https://mempool.space/api/address/${address}`);
    const data = await response.json();
    setAddressDetails(data);
  }

  const fetchBTCPrice = async () => {
    const response = await fetch('https://mempool.space/api/v1/prices');
    const data = await response.json();
    setBTCPrice(data.USD);
  }

  const fetchWithRetry = async (url, retries = 5, backoff = 3000) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : backoff * (i + 1);
            console.log(`429 Too Many Requests. Retrying after ${waitTime / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (response.ok) {
            return response;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    throw new Error('Exceeded retry limit');
  };

  const fetchHistoricalPrice = async (timestamp) => {
    const url = `https://mempool.space/api/v1/historical-price?currency=USD&timestamp=${timestamp}`;
    const response = await fetchWithRetry(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.prices[0].USD;
};

  const calculateBalancesAndValues = async (transactions) => {
    let balance = addressDetails.chain_stats.funded_txo_sum - addressDetails.chain_stats.spent_txo_sum;  // Starting balance
    const transactionsWithValues = [];

    for (const tx of transactions) {
        const received = tx.vout.reduce((sum, output) => sum + (output.value || 0), 0);
        const spent = tx.vin.reduce((sum, input) => sum + (input.prevout.value || 0), 0);
        balance += (received - spent);

        const txTime = tx.status.block_time * 1000;
        const price = await fetchHistoricalPrice(txTime / 1000);
        const balanceValue = balance * price;

        transactionsWithValues.push({
            ...tx,
            balance: balance,
            balanceValue: balanceValue,
            transactionValue: Math.abs(received - spent)
        });
    }

    return transactionsWithValues;
  }

  const fetchTransactions = async (url, transactions = []) => {
    const baseUrl = `https://mempool.space/api/address/${address}/txs`;
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    const response = await fetchWithRetry(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    transactions = transactions.concat(data);

    // Check if we have more transactions to fetch
    const lastTransactionTime = data[data.length - 1].status.block_time * 1000;
    if (data.length === 25 && lastTransactionTime > oneYearAgo && transactions.length < 100) {
        const lastTxId = data[data.length - 1].txid;
        const nextUrl = `${baseUrl}?last_seen_txid=${lastTxId}`;
        return fetchTransactions(nextUrl, transactions);
    }

    console.log(transactions)
    const calculatedTransactions = await calculateBalancesAndValues(transactions);
    setFullAddressHistory(calculatedTransactions);
    console.log(fullAddressHistory);
  }

  // const getHistoricalPrices = async ()

  useEffect(() => {
    if (!signedIn) {
      setLoginPopUpOpen(true);
    }
    if (window.location.href.includes('user')) {
      setSignedIn(true);
      fetchBTCAddress();
    }
    if (address) {
      console.log(address)
      fetchBTCAddressDetails();
      fetchBTCPrice();
    }
  }, [address]);

  useEffect(() => {
    if (signedIn) {
      setLoginPopUpOpen(false);
    }
  }, [signedIn]);

  useEffect(() => {
    if (addressDetails) {
      fetchTransactions(`https://mempool.space/api/address/${address}/txs`);
    }
  }, [address, addressDetails]);

  return (
    <div className={`App`}>
      { 
        (loginPopUpOpen || btcPopUpOpen) && 
        <PopUp 
          signedIn={signedIn} 
          setSignedIn={setSignedIn} 
          handleClose={() => { setLoginPopUpOpen(false); setBTCPopUpOpen(false) }} 
          btcOpen={btcPopUpOpen} 
          loginOpen={loginPopUpOpen} 
          setBTCPopUpOpen={setBTCPopUpOpen}
        /> 
      }
      <div className="dashboard-header">
        <img className="anchorwatch-logo" src={anchorwatchLogo} />
        <h1>Dashboard</h1>
        <img className="eye-icon" src={eyeIcon} />
      </div>
      <div className="address-container">
        { address && <p className="address">{address.slice(0, 10) + "..." + address.slice(-10)}</p>}
        <div className="live-total-container">
          { addressDetails && <img className="slanted-bitcoin-icon" src={slantedBitcoinIcon}/>}
          { addressDetails && <p className="bitcoin-total">{(addressDetails.chain_stats.funded_txo_sum - addressDetails.chain_stats.spent_txo_sum) / 100000000} BTC</p>}
          { (addressDetails && btcPrice) && <p className="usd-total">${(btcPrice * ((addressDetails.chain_stats.funded_txo_sum - addressDetails.chain_stats.spent_txo_sum) / 100000000)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>}
        </div>
      </div>
      <div className="dashboard-container">
        <QuickActions setBTCPopUpOpen={setBTCPopUpOpen} />
        <div className="wallet-data-container">
          <div className="wallet-data-header"></div>
          {/* { fullAddressHistory && <Holdings fullAddressHistory={fullAddressHistory} />} */}
          <Transactions fullAddressHistory={fullAddressHistory} address={address} />
        </div>
      </div>
    </div>
  );
};

export default App;