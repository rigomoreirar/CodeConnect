import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const createPost = async (postData, setPosts, token) => {
    const preparedPostData = { ...postData };

    if (
        preparedPostData.creator &&
        typeof preparedPostData.creator.id !== "undefined"
    ) {
        preparedPostData.creator.id = String(preparedPostData.creator.id);
    }

    if (Array.isArray(preparedPostData.categories)) {
        preparedPostData.categories = preparedPostData.categories.map(
            (category) => ({
                ...category,
                id: String(category.id),
            })
        );
    }

    const response = await axios.post(
        endpoints.posts.createPost,
        preparedPostData
    );

    // Fetch all posts again to ensure the newly created post is included
    const updatedData = await fetchAllData(token);
    setPosts(updatedData.posts);

    return response.data;
};

export const fetchUserPosts = async (userId) => {
    const response = await axios.get(endpoints.user.getAllData, {
        params: { user_id: String(userId) },
    });
    const { posts } = response.data;
    return posts.filter((post) => post.creator === String(userId));
};
