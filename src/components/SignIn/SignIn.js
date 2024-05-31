import React, { useState, useEffect } from 'react';
import './SignIn.css';
import externalLink from '../../assets/external-link.png';
import timerIcon from '../../assets/timer-icon.png';

function SignIn({ page, setPage }) {
    const [ email, setEmail ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ isEmailValid, setIsEmailValid ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ resendTimer, setResendTimer ] = useState(30);

    const handleSubmit = async (e) => {
        const response = await fetch('/.netlify/functions/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.text();
        if (response.status === 404) {
            setErrorMessage(result);
            setIsEmailValid(false);
        } else {
            setErrorMessage('');
            setPage(2);
            setResendTimer(30);
        }
    };

    const handleChange = ({ target }) => {
        setEmail(target.value);
        setErrorMessage('');
        if (target.validity.valid) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    }

    useEffect(() => {
        if (page === 2) {
            const intervalId = setInterval(() => {
                setResendTimer(prevTimer => {
                    if (prevTimer <= 0) {
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
    
            return () => clearInterval(intervalId);
        }
    }, [page]);

    return (
        <div className={`sign-in ${page === 1 ? '' : 'two'}`}>
            <div className="sign-in-form-container">
                <p className="sign-in-prompt">{page === 1 ? 'Enter Your Anchorwatch registered email' : "Check your inbox for a sign in link. which is valid for 10 minutes, if you don’t receive it in 30 seconds press resend to receive another link."}</p>
                {
                    page === 1 && 
                    <form className="sign-in-form">
                        <label for="email">Email</label>
                        <input
                            id="email"
                            className={errorMessage && 'error'}
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </form>
                }
                { page === 1 && <p className="sign-in-error">{errorMessage}</p> }
            </div>
            { 
                page === 1 ? 
                <div className="sign-in-button-container">
                    <div className="sign-in-help-container">
                        <p className="sign-in-help-message">Need Help?</p>
                        <img className="sign-in-help" src={externalLink} />
                    </div>
                    <button className={`sign-in-button ${isEmailValid ? 'valid' : ''}`} onClick={() => isEmailValid && handleSubmit()}>Next</button>
                </div> :
                <div className="sign-in-resend-button-container">
                    <button className={`sign-in-button ${resendTimer === 0 ? 'valid' : ''}`} onClick={() => isEmailValid && handleSubmit()}>Resend</button>
                    { resendTimer !== 0 && <img className="sign-in-timer" src={timerIcon} /> }
                    { resendTimer !== 0 && <p className="sign-in-timer-text">{resendTimer} seconds</p> }
                </div>
            }
        </div>
    );
}

export default SignIn;