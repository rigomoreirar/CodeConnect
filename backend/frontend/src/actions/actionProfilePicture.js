import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const getProfilePicture = async (userId) => {
    const response = await axios.get(endpoints.profile.getProfilePicture(userId), {
        responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
};

export const changeProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.post(endpoints.profile.changeProfilePicture, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
