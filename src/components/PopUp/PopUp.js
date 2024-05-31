import React, { useState } from 'react';
import './PopUp.css';
import SignIn from '../SignIn/SignIn';
import popUpIllustration from '../../assets/Popup - Illustration.png';
import stepper1 from '../../assets/Stepper-1.png';
import stepper2 from '../../assets/Stepper-2.png';
import closeIcon from '../../assets/close-icon.png';
import backIcon from '../../assets/back-icon.png';
import linkSent from '../../assets/link-sent.png';
import BitcoinLookup from '../BitcoinLookup/BitcoinLookup';
import bitcoinPopUp from '../../assets/bitcoin-popup.png';

function PopUp({ signedIn, setSignedIn, handleClose, btcOpen, loginOpen, setBTCPopUpOpen }) {
    const [ page, setPage ] = useState(1);

    return (
        <div className="overlay">
            <div className="pop-up">
                <div className="pop-up-header">
                    <img className={`pop-up-back-icon ${page === 1 ? '' : 'visible'}`} src={backIcon} onClick={() => setPage(1)} />
                    <img className={`stepper ${loginOpen ? 'visible' : ''}`} src={page === 1 ? stepper1 : stepper2} />
                    <img className="pop-up-close-icon" src={closeIcon} onClick={handleClose} />
                </div>
                <div className="sign-in-title-container">
                    <h2 className="sign-in-title">{loginOpen ? "Log In To Your Account" : "Add BTC Address"}</h2>
                </div>
                <div className="pop-up-body">
                    {
                        loginOpen ?
                        <SignIn page={page} setPage={setPage} /> :
                        <BitcoinLookup setBTCPopUpOpen={setBTCPopUpOpen} />
                    }
                    <div className="image-container">
                        {
                            loginOpen ?
                            <img className="pop-up-image" src={page === 1 ? popUpIllustration : linkSent} /> :
                            <img className="pop-up-image" src={bitcoinPopUp} />   
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;