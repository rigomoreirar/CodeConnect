import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import axios from "axios";

const FormField = ({ icon, label, type, value, setValue, id }) => {
    return (
        <div className="d-flex flex-row align-items-center mb-4">
            <div
                className="icon-container d-flex justify-content-center align-items-center me-3"
                style={{ marginTop: "1.8rem", marginRight: "0.5rem" }}
            >
                <i className={icon}></i>
            </div>
            <div className="form-outline flex-fill mb-0">
                <label className="form-label" htmlFor={id}>
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
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const handleRegister = () => {
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
        axios
            .post("http://localhost:8000/register/", {
                first_name: name,
                last_name: lastName,
                username: username,
                password: password,
                email: email,
            })
            .then(function (response) {
                const token = `Token ${response.data.token}`;
                window.localStorage.setItem("token", token);
                navigate("/");
            })
            .catch(function (error) {
                console.log(error);
                error.response.data.username
                    ? alert(error.response.data.username)
                    : console.log("Username passed");
                error.response.data.email
                    ? alert(error.response.data.email)
                    : console.log("Email passed");
            });
    };

    return (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div
                            className="card text-black"
                            style={{ borderRadius: "25px" }}
                        >
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <div className="text-center h1 fw-bold mb-5 mx-md-4 mt-4">
                                            <Logo size="50px" />
                                            &nbsp;Register
                                        </div>
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
                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button
                                                    onClick={handleRegister}
                                                    type="button"
                                                    className="btn btn-dark btn-lg"
                                                >
                                                    Register
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-center mx-4 mb-1 mb-lg-4">
                                                Already have an account?
                                            </div>
                                            <div className="d-flex justify-content-center mb-3 mb-lg-4">
                                                <Link to="/">
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark btn-lg"
                                                    >
                                                        Login
                                                    </button>
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-6 d-flex align-items-center order-1 order-lg-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                            className="img-fluid"
                                            alt="Register"
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
