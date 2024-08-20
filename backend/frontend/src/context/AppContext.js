import React, { createContext, useState, useEffect } from "react";
import {
    categories as staticCategories,
    posts as staticPosts,
    user as staticUser,
    proposals as staticProposals,
} from "../utils/store";
import { fetchAllData } from "../actions/actionAppContext";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(staticUser);
    const [categories, setCategories] = useState(staticCategories);
    const [posts, setPosts] = useState(staticPosts);
    const [proposals, setProposals] = useState(staticProposals);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const token = localStorage.getItem("token");
        if (isLoggedIn && token) {
            fetchAllData(token)
                .then((data) => {
                    setUser(data.user);
                    setCategories(data.categories);
                    setPosts(data.posts);
                    setProposals(data.proposals); // Update proposals state here
                })
                .catch((err) => {
                    console.error("Failed to fetch data:", err);
                    if (
                        err.response &&
                        err.response.status === 401 &&
                        err.response.data.detail === "Invalid token."
                    ) {
                        localStorage.setItem("isLoggedIn", "false");
                        localStorage.removeItem("token");
                        window.location.reload();
                    }
                });
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                user,
                categories,
                posts,
                profilePictureUrl,
                proposals,
                setUser,
                setCategories,
                setPosts,
                setProfilePictureUrl,
                setProposals,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
