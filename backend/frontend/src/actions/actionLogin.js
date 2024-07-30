import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(endpoints.auth.login, { username, password });
        const { user_info, token } = response.data;
        const updatedUser = { ...user_info, isLoggedIn: true, token };

        // Store token in local storage
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('isLoggedIn', 'true');

        // Fetch all data
        const allDataResponse = await axios.get(endpoints.user.getAllData, {
            headers: { Authorization: `Token ${token}` },
        });

        const { categories, posts } = allDataResponse.data;

        return {
            user: updatedUser,
            categories,
            posts,
        };
    } catch (error) {
        throw new Error('Login failed');
    }
};
