const environment = "development"; // Change this as needed

const baseURL =
    environment === "development" ? "http://localhost:8000/api" : "/api";
const baseURLSSE =
    environment === "development" ? "http://localhost:8000/sse" : "/sse";

const endpoints = {
    auth: {
        register: `${baseURL}/register/`,
        login: `${baseURL}/login/`,
        logout: `${baseURL}/logout/`,
    },
    user: {
        getAllData: `${baseURL}/get-all-data/`,
        editUserInfo: `${baseURL}/edit-user-info/`,
        changeUserPassword: `${baseURL}/change-user-password/`,
    },
    profile: {
        changeProfilePicture: `${baseURL}/change-profile-picture/`,
        getProfilePicture: (userId) => `${baseURL}/profile-picture/${userId}/`,
        getProfilePictureByUsername: (username) =>
            `${baseURL}/profile-picture-username/${username}/`,
    },
    interactions: {
        createLike: `${baseURL}/create-like/`,
        createDislike: `${baseURL}/create-dislike/`,
        addComment: `${baseURL}/add-comment/`,
        deleteComment: `${baseURL}/delete-comment/`,
    },
    posts: {
        createPost: `${baseURL}/create-post/`,
        deletePost: `${baseURL}/delete-post/`,
    },
    categories: {
        createCategory: `${baseURL}/create-category/`,
        deleteCategory: `${baseURL}/delete-category/`,
        followCategory: `${baseURL}/follow-category/`,
        unfollowCategory: `${baseURL}/unfollow-category/`,
        getCategoriesByUser: (userId) =>
            `${baseURL}/categories-by-user/${userId}/`,
    },
    proposals: {
        createProposal: `${baseURL}/proposals/`, // Ensure this is correct
        deleteProposal: (proposalId) =>
            `${baseURL}/proposals/${proposalId}/delete/`,
        likeProposal: `${baseURL}/proposals/vote/`,
    },
    emails: {
        sendTestEmail: `${baseURL}/send-test-email/`,
        resetUserPasswordEmail: `${baseURL}/reset-user-password-email/`,
    },
    sse: {
        sseEndpoint: `${baseURLSSE}/sse/`,
    },
};

export default endpoints;
