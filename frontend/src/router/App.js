import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Redirect from "../pages/Redirect";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Feed from "../pages/Feed";
import NotFound from "../pages/NotFound";

function App() {
    const token = window.localStorage.getItem("token");
    const [isValid, setIsValid] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});
    const [categories, setCategories] = useState([]);
    const [catArray, setCatArray] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setIsValid(false);
                    return;
                }

                const response = await axios.get(
                    "backend/user/",
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                const user = response.data.user_info;
                setLoggedUser(user);
                setIsValid(true);
            } catch (error) {
                console.log(error);
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("isLoggedIn");
                setLoggedUser({});
                setIsValid(false);
            }

            try {
                const response = await axios.get(
                    "backend/all-categories"
                );
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token]);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={!isValid ? <Login /> : <Navigate to="/forum" />}
                />
                <Route
                    path="/forum"
                    element={isValid ? <Layout /> : <Navigate to="/" />}
                >
                    <Route
                        index
                        element={
                            <Home
                                categories={categories}
                                currentUser={loggedUser}
                            />
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <Profile
                                categories={categories}
                                currentUser={loggedUser}
                                catArray={catArray}
                                setCatArray={setCatArray}
                            />
                        }
                    />
                    <Route
                        path="community"
                        element={
                            <Community
                                categories={categories}
                                currentUser={loggedUser}
                                catArray={catArray}
                                setCatArray={setCatArray}
                            />
                        }
                    />
                    <Route
                        path="my-feed"
                        element={
                            <Feed
                                categories={categories}
                                currentUser={loggedUser}
                            />
                        }
                    />
                </Route>
                <Route
                    path="/register"
                    element={
                        !isValid ? <Register /> : <Navigate to="/forum" />
                    }
                />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
