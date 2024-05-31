import React from 'react';

function Transaction({ tx }) {
    return (
        <div className="transaction">
            <p>{tx.txid}</p>
        </div>
    )
}

export default Transaction;