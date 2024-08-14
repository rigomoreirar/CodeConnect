import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const likePost = async (postId, userId, unlike) => {
    const response = await axios.post(endpoints.interactions.createLike, {
        post: { id: String(postId) },
        user: { id: String(userId) },
        unlike: unlike, // Send the boolean directly
    });
    return response.data;
};

export const dislikePost = async (postId, userId, undislike) => {
    const response = await axios.post(endpoints.interactions.createDislike, {
        post: { id: String(postId) },
        user: { id: String(userId) },
        undislike: undislike, // Send the boolean directly
    });
    return response.data;
};

export const deletePost = async (postId, userId) => {
    const response = await axios.post(endpoints.posts.deletePost, {
        post_id: String(postId),
        user_id: String(userId),
    });
    return response.data;
};

export const fetchAllPosts = async (token) => {
    const data = await fetchAllData(String(token));
    return data.posts;
};
