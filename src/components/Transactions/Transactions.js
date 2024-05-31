import React from 'react';
import Transaction from './Transaction';

function Transactions({ fullAddressHistory }) {
    return (
        <div className="holdings">
            <div className="holdings-header">
                <h2>Transactions</h2>
            </div>
            <div className="transactions-container">
                {
                    fullAddressHistory &&
                    fullAddressHistory.map(tx => <Transaction tx={tx} />)
                }
            </div>
        </div>
    )
}

export default Transactions;