import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppProvider } from "../context/AppContext";
import SSEHandler from "../utils/SSEHandler";

import Layout from "../containers/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RedirectPage from "../pages/Redirect";
import Profile from "../pages/Profile";
import MyPosts from "../pages/MyPosts";
import CategoriesProposal from "../pages/CategoriesProposal";
import CreateCategory from "../pages/CreateCategories";
import Feed from "../pages/Feed";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/ResetPassword";
import EditProfile from "../pages/EditProfile";
import NewPassword from "../pages/NewPassword";

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={!isLoggedIn ? <Login /> : <Navigate to="/forum" />}
                />
                <Route
                    path="/forum"
                    element={isLoggedIn ? <Layout /> : <Navigate to="/" />}
                >
                    <Route index element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="my-posts" element={<MyPosts />} />
                    <Route
                        path="categories-proposal"
                        element={<CategoriesProposal />}
                    />
                    <Route
                        path="create-categories"
                        element={<CreateCategory />}
                    />
                    <Route path="my-feed" element={<Feed />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="new-password" element={<NewPassword />} />
                </Route>
                <Route
                    path="/register"
                    element={
                        !isLoggedIn ? <Register /> : <Navigate to="/forum" />
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        !isLoggedIn ? (
                            <ResetPassword />
                        ) : (
                            <Navigate to="/forum" />
                        )
                    }
                />
                <Route path="/redirect" element={<RedirectPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <AppProvider>
            <SSEHandler />
            <AppContent />
        </AppProvider>
    );
}

export default App;
