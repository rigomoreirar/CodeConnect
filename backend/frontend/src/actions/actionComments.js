import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const addComment = async (postId, profileId, content) => {
    const response = await axios.post(endpoints.interactions.addComment, {
        post: String(postId),
        profile: String(profileId),
        content: String(content),
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
        endpoints.profile.getProfilePictureByUsername(String(username)),
        {
            responseType: "blob",
        }
    );
    return URL.createObjectURL(response.data);
};
