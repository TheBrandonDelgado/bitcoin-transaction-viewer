import React, { useState } from 'react';
import './BitcoinLookup.css';
import externalLink from '../../assets/external-link.png';

function BitcoinLookup({ setBTCPopUpOpen }) {
    const [ address, setAddress ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');

    const handleChange = ({ target }) => {
        setAddress(target.value);
    }

    const handleSubmit = async (e) => {
        try {
            const response = await fetch(`/.netlify/functions/api/add-address/${window.location.href.slice(-1)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            });

            if (!response.ok) {
                setErrorMessage('Invalid Bitcoin Address');
            }

            setBTCPopUpOpen(false);
        } catch (error) {
            console.error('Error during fetch operation:', error); // Log any errors that occur
        }
    };

    return (
        <div className="bitcoin-lookup">
            <div className="bitcoin-lookup-form-container">
                <p className="bitcoin-lookup-prompt">Enter the address below to add to your vault</p>
                <form className="bitcoin-lookup-form">
                    <label for="address">Address</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={handleChange}
                        placeholder="Enter address here"
                        maxlength="46"
                        required
                    />
                </form>
                <p className="bitcoin-lookup-info">46 character maximum</p>
                <p className="bitcoin-lookup-error">{errorMessage}</p>
            </div>
            <div className="bitcoin-lookup-button-container">
                <div className="bitcoin-lookup-help-container">
                    <p className="bitcoin-lookup-help-message">Need Help?</p>
                    <img className="bitcoin-lookup-help" src={externalLink} />
                </div>
                <button className={`bitcoin-lookup-button ${address ? 'valid' : ''}`} onClick={handleSubmit}>Add</button>
            </div> 
        </div>
    );
}

export default BitcoinLookup;