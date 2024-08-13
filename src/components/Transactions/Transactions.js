import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import sortIcon from '../../assets/sort-icon.png';

function Transactions({ fullAddressHistory, address }) {
    const sortIconElement = <img className="sort-icon" src={sortIcon} />;
    const [ sortChoice, setSortChoice ] = useState('date');
    const [ sortDirection, setSortDirection ] = useState(false);
    const [sortedTransactions, setSortedTransactions] = useState([]);

    const handleSort = (choice) => {
        if (sortChoice !== choice) {
            setSortChoice(choice);
            setSortDirection(false);
        } else {
            setSortDirection(!sortDirection);
        }
    };

    const sortTransactions = () => {
        if (!fullAddressHistory) return;

        let sorted = [...fullAddressHistory];
        if (sortChoice === 'amount') {
            sorted.sort((a, b) => a.transactionValue - b.transactionValue);
        } else if (sortChoice === 'status') {
            sorted.sort((a, b) => a.status.confirmed - b.status.confirmed);
        }
        if (sortDirection) {
            sorted.reverse();
        }
        setSortedTransactions(sorted);
        console.log(sortedTransactions)
    };

    useEffect(() => {
        if (fullAddressHistory) {
            setSortedTransactions([...fullAddressHistory]);
        }
    }, [fullAddressHistory]);

    useEffect(() => {
        sortTransactions();
    }, [sortChoice, sortDirection, fullAddressHistory]);

    return (
        <div className="transactions">
            <div className="transactions-header">
                <h2>Transactions</h2>
            </div>
            <div className="transactions-container">
                <p className="transactions-headers-type">Type</p>
                <p className={`transactions-headers-date ${sortChoice === 'date' ? 'sort' : ''}`} onClick={() => handleSort('date')}>Date {sortChoice === 'date' && sortIconElement}</p>
                <p className="transactions-headers-tx-id">TX ID</p>
                <p className={`transactions-headers-amount ${sortChoice === 'amount' ? 'sort' : ''}`} onClick={() => handleSort('amount')}>Amount (BTC) {sortChoice === 'amount' && sortIconElement}</p>
                <p className="transactions-headers-balance">Balance (BTC)</p>
                <p className={`transactions-headers-status ${sortChoice === 'status' ? 'sort' : ''}`} onClick={() => handleSort('status')}>Status {sortChoice === 'status' && sortIconElement}</p>
                {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((tx) => (
                        <Transaction tx={tx} address={address} />
                    ))
                ) : (
                    <p>No transactions available</p>
                )}
            </div>
        </div>
    )
}

export default Transactions;