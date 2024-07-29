import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Logo from "../components/Logo";
import "../styles/Header.css";

const Header = () => {
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("isLoggedIn");

        setUser((prevUser) => ({
            ...prevUser,
            isLoggedIn: false,
            token: null,
        }));

        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">
                <Logo size="50px" />
                &nbsp;&nbsp;&nbsp;CodeConnect
            </Link>
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
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/forum">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/forum/my-feed">
                            My Feed
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/forum/community">
                            Community
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/forum/profile">
                            My Profile
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={handleLogout}
                            className="btn btn-link nav-link"
                            type="button"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
