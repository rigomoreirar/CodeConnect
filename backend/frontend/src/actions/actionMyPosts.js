import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const createPost = async (postData) => {
    const response = await axios.post(endpoints.posts.createPost, postData);
    return response.data;
};

export const fetchUserPosts = async (userId) => {
    const response = await axios.get(endpoints.user.getAllData, {
        params: { user_id: userId }
    });
    const { posts } = response.data;
    return posts.filter(post => post.creator === userId);
};
