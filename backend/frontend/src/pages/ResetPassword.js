// pages/ResetPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css';
import Logo from '../components/Logo';
import { resetPassword } from '../actions/actionResetPassword';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await resetPassword(email);
            alert('Check your email for the reset password instructions.');
            setEmail('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Enter a valid email address or check your internet connection.');
        }
    };

    return (
        <>
            <section className="main-container" style={{ backgroundColor: '#eee' }}>
                <div className="resetingcard">
                    <div className="d-flex row justify-content-center align-items-center">
                        <div className="col-md-4 d-flex justify-content-center mt-3">
                            <div className="start-0 m-3 d-flex row justify-content-start align-items-start">
                                <Link to="/" className="btn btn-dark btn-sm">
                                    Back
                                </Link>
                            </div>
                            <Logo size="150px" />
                        </div>
                        <div className="col-md-8 d-flex flex-column align-items-center">
                            <h1 className="mb-4">Reset Password</h1>
                            <form onSubmit={handleSubmit} className="w-100 px-3">
                                <div className="d-flex flex-column align-items-left mb-4">
                                    <strong>
                                        <label className="form-label">Enter your email:</label>
                                    </strong>
                                    <div className="form-outline flex-fill mb-0">
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            id="userEmail"
                                            value={email}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-dark btn-lg">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ResetPassword;
