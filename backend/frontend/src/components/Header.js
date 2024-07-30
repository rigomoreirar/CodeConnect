import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../actions/actionHeader";
import Logo from "./Logo";
import "../styles/Header.css";

const Header = () => {
    const { setUser } = useContext(AppContext);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logoutUser();

        setUser((prevUser) => ({
            ...prevUser,
            isLoggedIn: false,
            token: null,
        }));

        window.location.reload();
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
                        <Link className="nav-link" to="/forum/my-posts">
                            My Posts
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/forum/create-categories">
                            Create Categories
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
