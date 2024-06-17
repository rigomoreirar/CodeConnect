import axios from "axios";
import { FaWolfPackBattalion } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const token = window.localStorage.getItem("token");
        axios
            .post(
                "backend/logout/",
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then(function (response) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("isLoggedIn");
                window.location.href = "/";
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <nav className="navbar navbar-dark bg-dark bg-light">
            <Link className="navbar-brand" to="/">
                <Logo size="50px" />
                &nbsp;&nbsp;&nbsp;CodeConnect
            </Link>
            <>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li>
                            <Link className="nav-item nav-link" to="/forum">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="nav-item nav-link"
                                to="/forum/my-feed"
                            >
                                My Feed
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/forum/community">
                                Community
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="nav-item nav-link"
                                to="/forum/profile"
                            >
                                My Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={handleLogout}
                                className="button-logout"
                                type="button"
                            >
                                Log out
                            </button>
                        </li>
                    </ul>
                </div>
            </>
        </nav>
    );
};

export default Header;
