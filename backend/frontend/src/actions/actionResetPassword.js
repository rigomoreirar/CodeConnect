import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const resetPassword = async (email) => {
    try {
        const response = await axios.post(
            endpoints.emails.resetUserPasswordEmail,
            { email: String(email) }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};
