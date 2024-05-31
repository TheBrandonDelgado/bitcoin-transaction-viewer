import React from 'react';
import './QuickActions.css';
import bitcoinIcon from '../../assets/bitcoin-icon.png';

function QuickActions({ setBTCPopUpOpen }) {
    return (
        <div className="quick-actions">
            <div className="quick-actions-header">
                <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-button-container">
                <button className="quick-actions-button" onClick={() => setBTCPopUpOpen(true)}>
                    <img className="quick-actions-bitcoin-icon" src={bitcoinIcon} />
                    Add BTC Address
                </button>
            </div>
        </div>
    );
}

export default QuickActions;