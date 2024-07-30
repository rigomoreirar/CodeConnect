import React, { createContext, useState, useEffect } from 'react';
import { categories as staticCategories, posts as staticPosts, user as staticUser } from '../utils/store';
import { fetchAllData } from '../actions/actionAppContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(staticUser);
    const [categories, setCategories] = useState(staticCategories);
    const [posts, setPosts] = useState(staticPosts);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const token = localStorage.getItem("token");
        if (isLoggedIn && token) {
            fetchAllData(token)
                .then(data => {
                    setUser(data.user);
                    setCategories(data.categories);
                    setPosts(data.posts);
                })
                .catch(err => {
                    console.error("Failed to fetch data:", err);
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
                setUser,
                setCategories,
                setPosts,
                setProfilePictureUrl,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
