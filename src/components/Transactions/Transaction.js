import React, { useState, useEffect } from 'react';
import './Transaction.css';

function Transaction({ tx, address }) {
    const satoshisToBTC = satoshis => satoshis / 100000000;
    const [transactionType, setTransactionType] = useState('');
    const [transactionId, setTransactionId] = useState(tx.txid);
    const [transactionDate, setTransactionDate] = useState();
    const [confirmed, setConfirmed] = useState(tx.status.confirmed);
    const [amount, setAmount] = useState(satoshisToBTC(tx.transactionValue));
    const [balance, setBalance] = useState(satoshisToBTC(tx.balance));

    useEffect(() => {
        getTransactionType();
        setConfirmed(tx.status.confirmed);
        getTransactionDate();
        setTransactionId(tx.txid);
        setBalance(satoshisToBTC(tx.balance));
        setAmount(satoshisToBTC(tx.transactionValue));
        console.log(transactionDate)
    }, [tx]);

    const getTransactionType = () => {
        tx.vin.forEach(input => {
            if (input.prevout.scriptpubkey_address === address) {
                setTransactionType('send');
            }
        });
        tx.vout.forEach(output => {
            if (output.scriptpubkey_address === address) {
                setTransactionType('receive');
            }
        });
    }

    const getTransactionDate = () => {
        if (tx.status.block_time) {
            const date = new Date(tx.status.block_time * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            setTransactionDate(date);
        }
    }

    return (
        <>
            <p className="transaction-type">{transactionType}</p>
            <p className={`transaction-date ${confirmed ? '' : 'no-date'}`}>{transactionDate}</p>
            <p className="transaction-id">{transactionId}</p>
            <p className="transaction-amount">{transactionType === 'receive' ? `+ ${amount}` : `- ${amount}`}</p>
            <p className="transaction-balance">{balance}</p>
            <p className={`transaction-status ${confirmed ? 'completed' : 'pending'}`}>{confirmed ? 'completed' : 'pending'}</p>
        </>
    )
}

export default Transaction;