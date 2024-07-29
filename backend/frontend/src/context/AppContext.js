import React, { createContext, useState, useEffect } from "react";
import { categories as staticCategories, posts as staticPosts, user as staticUser } from "../utils/store";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(staticUser);
    const [categories, setCategories] = useState(staticCategories);
    const [posts, setPosts] = useState(staticPosts);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        if (user.id) {
            setProfilePictureUrl(`http://localhost:8000/profile-picture/${user.id}/`);
        }
    }, [user]);

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
