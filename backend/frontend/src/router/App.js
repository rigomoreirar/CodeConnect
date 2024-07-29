import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppProvider, AppContext } from "../context/AppContext";

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
import NewPassword from "../pages/NewPassword";

function AppContent() {
    const { user, categories, posts, profilePictureUrl } = useContext(AppContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={!user.isLoggedIn ? <Login /> : <Navigate to="/forum" />}
                />
                <Route
                    path="/forum"
                    element={user.isLoggedIn ? <Layout /> : <Navigate to="/" />}
                >
                    <Route
                        index
                        element={<Home />}
                    />
                    <Route
                        path="profile"
                        element={<Profile />}
                    />
                    <Route
                        path="community"
                        element={<Community />}
                    />
                    <Route
                        path="my-feed"
                        element={<Feed />}
                    />
                    <Route
                        path="edit-profile"
                        element={<EditProfile />}
                    />
                    <Route
                        path="new-password"
                        element={<NewPassword />}
                    />
                </Route>
                <Route
                    path="/register"
                    element={!user.isLoggedIn ? <Register /> : <Navigate to="/forum" />}
                />
                <Route
                    path="/reset-password"
                    element={!user.isLoggedIn ? <ResetPassword /> : <Navigate to="/forum" />}
                />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
