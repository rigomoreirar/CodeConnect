import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const editUserProfile = async (updatedUser) => {
    try {
        const response = await axios.post(endpoints.user.editUserInfo, updatedUser);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Something went wrong');
    }
};
