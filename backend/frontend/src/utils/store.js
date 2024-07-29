// Categories data
const categories = [
    {
      id: 1,
      name: "Category1"
    },
    {
      id: 2,
      name: "Category2"
    },
    {
      id: 3,
      name: "Category3"
    },
    {
      id: 4,
      name: "UserCategory1"
    },
    {
      id: 5,
      name: "UserCategory2"
    }
];

// Posts data
const posts = [
    {
      id: 1,
      title: "Post Title",
      content: "Post content...",
      likes: [
        {
          id: 1,
          profile: 1
        },
        {
          id: 2,
          profile: 2
        }
      ],
      dislikes: [
        {
          id: 1,
          profile: 3
        }
      ],
      comments: [
        {
          id: 1,
          profile: 1,
          content: "Great post!"
        },
        {
          id: 2,
          profile: 2,
          content: "Thanks for sharing!"
        }
      ],
      categories: [
        {
          id: 1,
          name: "Category1"
        },
        {
          id: 2,
          name: "Category2"
        }
      ]
    }
];

// User data
const user = {
    id: 1,
    username: "currentUsername",
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    profile_data: {
      ctg_following: [
        {
          id: 1,
          name: "Category1"
        },
        {
          id: 2,
          name: "Category2"
        }
      ]
    },
    total_likes: 2,
    total_dislikes: 1,
    total_comments: 2,
    token: "static-token",
    isLoggedIn: false
};

export { categories, posts, user };
