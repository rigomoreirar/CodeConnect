import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { registerUser } from "../actions/actionRegister";

import styles from "../styles/Register.module.css";

import Logo from "../components/Logo";
import RegisterProfilePicture from "../components/RegisterProfilePicture";

const FormField = ({ icon, label, type, value, setValue, id }) => {
    return (
        <div className="d-flex flex-row align-items-center mb-4">
            <div
                className={`${styles.iconContainer} d-flex justify-content-center align-items-center me-3`}
                style={{ marginTop: "1.8rem", marginRight: "0.5rem" }}
            >
                <i className={icon}></i>
            </div>
            <div className="form-outline flex-fill mb-0">
                <label className={styles.formLabel} htmlFor={id}>
                    {label}
                </label>
                <input
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    type={type}
                    id={id}
                    className="form-control"
                />
            </div>
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const { setUser, setCategories, setPosts } = useContext(AppContext);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

    const handleRegister = async () => {
        if (
            !name ||
            !lastName ||
            !email ||
            !username ||
            !password ||
            !confirmation
        ) {
            alert("No blanks!");
            return;
        }
        if (password !== confirmation) {
            alert("Passwords must match");
            return;
        }

        const userData = {
            first_name: name,
            last_name: lastName,
            email,
            username,
            password,
        };

        try {
            const { user, categories, posts } = await registerUser(userData, profilePicture);
            setUser(user);
            setCategories(categories);
            setPosts(posts);
            alert("User registered successfully!");
            navigate("/forum");
        } catch (error) {
            alert("Error registering user");
            console.error("Registration error:", error);
        }
    };

    return (
        <section className={styles.vh100} style={{ backgroundColor: "#eee" }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className={`card ${styles.card}`}>
                            <div className="card-body p-md-5">
                                <div className="text-center h1 fw-bold mb-5 mx-md-4 mt-4">
                                    <Logo size="50px" />
                                    &nbsp;Register
                                </div>
                                <div className="row justify-content-center">
                                    <div
                                        className={`col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1 ${styles.formContainer}`}
                                    >
                                        <form className="mx-1 mx-md-4">
                                            <FormField
                                                icon="fas fa-user fa-lg fa-fw"
                                                label="Name"
                                                type="text"
                                                value={name}
                                                setValue={setName}
                                                id="name"
                                            />
                                            <FormField
                                                icon="fas fa-user fa-lg fa-fw"
                                                label="Last Name"
                                                type="text"
                                                value={lastName}
                                                setValue={setLastName}
                                                id="lastName"
                                            />
                                            <FormField
                                                icon="fas fa-envelope fa-lg fa-fw"
                                                label="Email"
                                                type="email"
                                                value={email}
                                                setValue={setEmail}
                                                id="email"
                                            />
                                            <FormField
                                                icon="fas fa-user-circle fa-lg fa-fw"
                                                label="Username"
                                                type="text"
                                                value={username}
                                                setValue={setUsername}
                                                id="username"
                                            />
                                            <FormField
                                                icon="fas fa-lock fa-lg fa-fw"
                                                label="Password"
                                                type="password"
                                                value={password}
                                                setValue={setPassword}
                                                id="password"
                                            />
                                            <FormField
                                                icon="fas fa-lock fa-lg fa-fw"
                                                label="Confirm Password"
                                                type="password"
                                                value={confirmation}
                                                setValue={setConfirmation}
                                                id="confirmation"
                                            />
                                            <div className="d-flex justify-content-center mx-4 mb-1 mb-lg-1">
                                                <button
                                                    onClick={handleRegister}
                                                    type="button"
                                                    className={`btn btn-dark btn-lg ${styles.btnDark}`}
                                                >
                                                    Register
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-center mx-1 mb-1 mb-lg-1">
                                                <strong>Or...</strong>
                                            </div>
                                            <div className="d-flex justify-content-center mb-3 mb-lg-4">
                                                <Link to="/">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-dark btn-lg ${styles.btnDark}`}
                                                    >
                                                        Back
                                                    </button>
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                    <div
                                        className={`col-md-10 col-lg-6 col-xl-6 d-flex align-items-center flex-column order-1 order-lg-2 ${styles.profilePictureContainer}`}
                                    >
                                        <RegisterProfilePicture
                                            setProfilePicture={
                                                setProfilePicture
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
