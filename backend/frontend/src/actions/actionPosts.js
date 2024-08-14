import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const likePost = async (postId, userId, unlike) => {
    const response = await axios.post(endpoints.interactions.createLike, {
        post: { id: postId },
        user: { id: userId },
        unlike,
    });
    return response.data;
};

export const dislikePost = async (postId, userId, undislike) => {
    const response = await axios.post(endpoints.interactions.createDislike, {
        post: { id: postId },
        user: { id: userId },
        undislike,
    });
    return response.data;
};

export const deletePost = async (postId, userId) => {
    const response = await axios.post(endpoints.posts.deletePost, {
        post_id: postId,
        user_id: userId,
    });
    return response.data;
};

export const fetchAllPosts = async (token) => {
    const data = await fetchAllData(token);
    return data.posts;
};
