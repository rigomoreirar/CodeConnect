import { useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { logoutUser } from "../actions/actionHeader";

import styles from "../styles/Header.module.css";

import Logo from "./Logo";

const Header = () => {
    const { setUser, user } = useContext(AppContext);

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

    const isModerator = user.username === "moderator";

    return (
        <nav className={`navbar navbar-expand-md navbar-dark bg-dark`}>
            <Link className="navbar-brand" to="/">
                <Logo size="50px" />
                &nbsp;&nbsp;&nbsp;CodeConnect
            </Link>
            <button
                className={`navbar-toggler ${styles["navbar-toggler"]}`}
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className={`collapse navbar-collapse ${styles["navbar-collapse"]}`}
                id="navbarNav"
            >
                <ul className={`navbar-nav ml-auto ${styles["navbar-nav"]}`}>
                    <li className={`nav-item ${styles["nav-item"]}`}>
                        <Link
                            className={`nav-link ${styles["nav-link"]}`}
                            to="/forum"
                        >
                            Home
                        </Link>
                    </li>
                    {isModerator ? (
                        <>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/create-categories"
                                >
                                    Create Categories
                                </Link>
                            </li>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/my-posts"
                                >
                                    Moderator Posts
                                </Link>
                            </li>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/profile"
                                >
                                    My Profile
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/my-feed"
                                >
                                    My Feed
                                </Link>
                            </li>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/my-posts"
                                >
                                    My Posts
                                </Link>
                            </li>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/categories-proposal"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li className={`nav-item ${styles["nav-item"]}`}>
                                <Link
                                    className={`nav-link ${styles["nav-link"]}`}
                                    to="/forum/profile"
                                >
                                    My Profile
                                </Link>
                            </li>
                        </>
                    )}
                    <li className={`nav-item ${styles["nav-item"]}`}>
                        <button
                            onClick={handleLogout}
                            className={`btn btn-link nav-link ${styles["btn-link"]}`}
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
