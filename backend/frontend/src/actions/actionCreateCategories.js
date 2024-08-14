import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const createCategory = async (userId, categoryName) => {
    const response = await axios.post(endpoints.categories.createCategory, {
        user_id: String(userId),
        name: String(categoryName),
    });
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await axios.post(endpoints.categories.deleteCategory, {
        id: String(categoryId),
    });
    return response.data;
};

export const fetchCategoriesByUser = async (userId, token) => {
    const response = await axios.get(
        endpoints.categories.getCategoriesByUser(String(userId)),
        {
            headers: { Authorization: `Token ${String(token)}` },
        }
    );
    return response.data;
};
