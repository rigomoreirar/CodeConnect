// actions/actionRegister.js

import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const registerUser = async (userData, profilePicture) => {
    const formData = new FormData();
    for (const key in userData) {
        formData.append(key, String(userData[key]));
    }
    if (profilePicture) {
        formData.append("profile_picture", profilePicture);
    }

    const response = await axios.post(endpoints.auth.register, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const { user_info, token } = response.data;
    const updatedUser = { ...user_info, isLoggedIn: true, token };

    // Store token in local storage
    window.localStorage.setItem("token", String(token));
    window.localStorage.setItem("isLoggedIn", "true");

    // Fetch all data
    const allDataResponse = await axios.get(endpoints.user.getAllData, {
        headers: { Authorization: `Token ${String(token)}` },
    });

    const { categories, posts } = allDataResponse.data;

    return {
        user: updatedUser,
        categories,
        posts,
    };
};
