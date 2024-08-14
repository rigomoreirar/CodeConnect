import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(endpoints.auth.login, {
            username: String(username),
            password: String(password),
        });
        const { user_info, token } = response.data;
        const updatedUser = {
            ...user_info,
            isLoggedIn: true,
            token: String(token),
        };

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
    } catch (error) {
        throw new Error("Login failed");
    }
};
