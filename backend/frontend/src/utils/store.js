// Categories data
const categories = [];

// Posts data
const posts = [];

// Proposals data
const proposals = [];

// User data
const user = {
    id: null,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    profile_data: {
        ctg_following: [],
    },
    total_likes: 0,
    total_dislikes: 0,
    total_comments: 0,
    token: "",
    isLoggedIn: false,
};

export { categories, posts, user, proposals };
