import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const changeUserPassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.post(endpoints.user.changeUserPassword, {
            current_password: String(currentPassword),
            new_password: String(newPassword),
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error("Something went wrong");
    }
};
