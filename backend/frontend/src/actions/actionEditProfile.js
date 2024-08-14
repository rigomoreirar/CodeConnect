import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const editUserProfile = async (updatedUser) => {
    // Convert all updatedUser values to strings
    const stringifiedUserData = {};
    for (const key in updatedUser) {
        if (updatedUser.hasOwnProperty(key)) {
            stringifiedUserData[key] = String(updatedUser[key]);
        }
    }

    try {
        const response = await axios.post(
            endpoints.user.editUserInfo,
            stringifiedUserData
        );
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error("Something went wrong");
    }
};
