import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const followCategory = async (categoryId, userId) => {
    const response = await axios.post(endpoints.categories.followCategory, {
        id: String(categoryId),
        user: { id: String(userId) },
    });
    return response.data;
};

export const unfollowCategory = async (categoryId, userId) => {
    const response = await axios.post(endpoints.categories.unfollowCategory, {
        id: String(categoryId),
        user: { id: String(userId) },
    });
    return response.data;
};
