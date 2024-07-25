import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/Axios"

import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Redirect from "../pages/Redirect";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Feed from "../pages/Feed";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/ResetPassword";
import EditProfile from "../pages/EditProfile";
import NewPassword  from "../pages/NewPassword";

function App() {
    const token = window.localStorage.getItem("token");
    const [isValid, setIsValid] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});
    const [categories, setCategories] = useState([]);
    const [catArray, setCatArray] = useState([]);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setIsValid(false);
                    return;
                }

                const response = await axios.get("user/", {
                    headers: {
                        Authorization: token,
                    },
                });

                const user = response.data.user_info;
                setLoggedUser(user);
                setProfilePictureUrl(`http://localhost:8000/profile-picture/${user.id}/`);
                setIsValid(true);
            } catch (error) {
                console.log(error);
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("isLoggedIn");
                setLoggedUser({});
                setIsValid(false);
            }

        };

        fetchData();

        const eventSource = new EventSource("/sse/categories/");
        eventSource.onmessage = (event) => {
            const updatedCategories = JSON.parse(event.data);
            setCategories(updatedCategories);
        };

        return () => {
            eventSource.close();
        };
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
                                setLoggedUser={setLoggedUser}
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
                                setLoggedUser={setLoggedUser}
                                profilePictureUrl={profilePictureUrl}
                                setProfilePictureUrl={setProfilePictureUrl}
                            />
                        }
                    />
                    <Route
                        path="community"
                        element={
                            <Community
                                categories={categories}
                                setCategories={setCategories}
                                currentUser={loggedUser}
                                catArray={catArray}
                                setCatArray={setCatArray}
                                setLoggedUser={setLoggedUser}
                            />
                        }
                    />
                    <Route
                        path="my-feed"
                        element={
                            <Feed
                                categories={categories}
                                currentUser={loggedUser}
                                setLoggedUser={setLoggedUser}
                            />
                        }
                    />
                    <Route
                        path="edit-profile"
                        element={
                            <EditProfile
                                currentUser={loggedUser}
                            />
                        }
                    />
                    <Route
                        path="new-password"
                        element={
                            <NewPassword
                                currentUser={loggedUser}
                            />
                        }
                    />
                </Route>
                <Route
                    path="/register"
                    element={!isValid ? <Register /> : <Navigate to="/forum" />}
                />
                <Route
                    path="/reset-password"
                    element={!isValid ? <ResetPassword /> : <Navigate to="/forum" />}
                />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
