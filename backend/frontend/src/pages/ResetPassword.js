import React, { useState } from "react";
import { Link } from "react-router-dom";

import { resetPassword } from "../actions/actionResetPassword";

import styles from "../styles/ResetPassword.module.css";

import Logo from "../components/Logo";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await resetPassword(email);
            alert("Check your email for the reset password instructions.");
            setEmail("");
            setErrorMessage("");
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(
                error.message ||
                    "Enter a valid email address or check your internet connection."
            );
        }
    };

    return (
        <section className={styles.mainContainer}>
            <div className={`card ${styles.resetCard}`}>
                <Link
                    to="/"
                    className={`btn btn-dark btn-sm ${styles.backButton}`}
                >
                    Back
                </Link>
                <Logo size="150px" />
                <h1 className={styles.title}>Reset Password</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="userEmail" className={styles.formLabel}>
                        Enter your email:
                    </label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="userEmail"
                        value={email}
                        className={styles.inputField}
                        required
                    />
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ResetPassword;
