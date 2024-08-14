// actions/actionHeader.js

import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const logoutUser = async () => {
    try {
        await axios.post(endpoints.auth.logout, {
            // Ensure any data sent is a string, even though this request doesn't send any data
            dummy: String("dummy"),
        });
        // Remove token and login status from local storage
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("isLoggedIn");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
