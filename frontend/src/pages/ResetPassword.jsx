import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";
import Logo from "../components/Logo";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("backend/reset-user-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Check your email for the reset password instructions.");
                setEmail("");
                setErrorMessage("");
            } else {
                setErrorMessage(
                    data.error ||
                        "An error occurred while resetting your password."
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(
                "Enter a valid email address or check your internet connection."
            );
        }
    };

    return (
        <>
            <section
                className="main-container"
                style={{ backgroundColor: "#eee" }}
            >
                <div className=" resetingcard">
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
                            <form
                                onSubmit={handleSubmit}
                                className="w-100 px-3"
                            >
                                <div className="d-flex flex-column align-items-left mb-4">
                                    <strong>
                                        <label className="form-label">
                                            Enter your email:
                                        </label>
                                    </strong>
                                    <div className="form-outline flex-fill mb-0">
                                        <input
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            type="email"
                                            id="userEmail"
                                            value={email}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                {errorMessage && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className="btn btn-dark btn-lg"
                                    >
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
