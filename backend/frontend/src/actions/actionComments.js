import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const addComment = async (postId, profileId, content) => {
    const response = await axios.post(endpoints.interactions.addComment, {
        post: postId,
        profile: profileId,
        content,
    });
    return response.data;
};

export const deleteComment = async (commentId, userId) => {
    const response = await axios.post(endpoints.interactions.deleteComment, {
        comment_id: String(commentId),
        user_id: String(userId),
    });
    return response.data;
};

export const fetchProfilePicture = async (username) => {
    const response = await axios.get(
        endpoints.profile.getProfilePictureByUsername(username),
        {
            responseType: "blob",
        }
    );
    return URL.createObjectURL(response.data);
};
