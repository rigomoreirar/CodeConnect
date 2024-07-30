import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const createCategory = async (userId, categoryName) => {
    const response = await axios.post(endpoints.categories.createCategory, {
        user_id: userId,
        name: categoryName,
    });
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await axios.post(endpoints.categories.deleteCategory, {
        id: categoryId,
    });
    return response.data;
};

export const fetchCategoriesByUser = async (userId, token) => {
    const response = await axios.get(endpoints.categories.getCategoriesByUser(userId), {
        headers: { Authorization: `Token ${token}` },
    });
    return response.data;
};
