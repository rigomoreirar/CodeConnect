import { useEffect, useState } from "react";
import Axios from "axios";
import "../styles/Home.css";
import "../styles/Create.css";
import "../styles/Comments-legacy.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import CategoryBox from "../containers/CategoryBox";
import Loader from "../components/Loader";

const Community = ({
    currentUser,
    categories,
    setCategories,
    catArray,
    setCatArray,
    setLoggedUser,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [userCategories, setUserCategories] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);
    const [visiblePostsCount, setVisiblePostsCount] = useState(3);

    useEffect(() => {
        console.log("Current user community:", currentUser);
    }, [currentUser]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `/backend/posts-by-user-id/?user_id=${currentUser.id}`
            );
            const postArray = Array.isArray(response.data) ? response.data : [];
            console.log("Posts by user ID:", postArray);
            setPosts(postArray.filter((post) => post.isStudent));
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        const userId = currentUser.id;
        try {
            const response = await Axios.get(
                `/backend/user-categories/?user_id=${userId}`
            );
            setUserCategories(
                Array.isArray(response.data) ? response.data : []
            );
            const allCategoriesResponse = await Axios.get(
                "/backend/all-categories/"
            );
            setCategories(
                Array.isArray(allCategoriesResponse.data)
                    ? allCategoriesResponse.data
                    : []
            );
            console.log("All categories in community:", allCategoriesResponse);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();

        // Set up Server-Sent Events (SSE) for categories
        const eventSource = new EventSource("/backend/sse/categories/");

        eventSource.onmessage = (event) => {
            console.log("New category message:", event.data);
            fetchCategories(); // Refetch categories when a new category is created
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [currentUser]);

    useEffect(() => {
        const filterPosts = () => {
            if (activeFilter.length === 0) {
                fetchPosts(); // Refetch posts if no filter is active
            } else {
                const filtered = posts.filter((post) =>
                    activeFilter.some((filter) =>
                        post.categories.includes(filter.name)
                    )
                );
                setPosts(filtered);
            }
        };

        filterPosts();
    }, [activeFilter]);

    const handleLoadMore = () => {
        setVisiblePostsCount((prevCount) => prevCount + 3);
    };

    const handleCommentAdded = (postId, newComment) => {
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, newComment],
                };
            }
            return post;
        });
        setPosts(updatedPosts);
    };

    const handleCommentDeleted = (postId, commentId) => {
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter(
                        (comment) => comment.id !== commentId
                    ),
                };
            }
            return post;
        });
        setPosts(updatedPosts);
    };

    const sortedPosts = posts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const post = {
            isStudent: true,
            creator: { id: currentUser.id }, // Only send the user ID
            title: formData.get("question"), // Change "question" to "title"
            content: formData.get("content"),
            categories: catArray,
        };

        if (!post.title || !post.content || post.categories.length === 0) {
            alert(
                "Please fill all the fields and select at least one category."
            );
            return;
        }

        if (post.title.length > 99) {
            alert(
                "Please be more concise with your question (max 100 characters)."
            );
            return;
        }

        if (post.content.length > 999) {
            alert("The description limit is 1000 characters.");
            return;
        }

        try {
            const response = await Axios.post("/backend/new-post/", post);
            console.log("New Post Response:", response.data);
            fetchPosts();
        } catch (error) {
            console.error("Error creating new post:", error);
        }
    };

    const handlePostDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryName = formData.get("category");

        try {
            await Axios.post("/backend/create-category/", {
                name: categoryName,
                user_id: currentUser.id,
            });
            console.log("Category created:", categoryName, " by ", currentUser);
            fetchCategories(); // Refresh categories after creation
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const handleCategoryDelete = async (categoryId) => {
        try {
            await Axios.post("/backend/delete-category/", {
                id: categoryId,
            });
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <>
            <div className="home-container">
                <Filters
                    categories={Array.isArray(categories) ? categories : []}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
                <div className="inner-main d-flex flex-column align-items-center">
                    <h1 className="mb-4 ml-3 mt-3 display-4">
                        Welcome back, {currentUser.first_name}
                    </h1>
                    <form onSubmit={handleSubmit} id="tweet-form">
                        <div id="tweetbox" className="wrapper mb-5">
                            <div className="input-box">
                                <h6>What's on your mind?</h6>
                                <input
                                    className="question mb-2"
                                    type="text"
                                    name="question"
                                />
                                <CategoryBox
                                    catArray={catArray}
                                    setCatArray={setCatArray}
                                    categories={categories}
                                />
                                <h6>Detail your post!</h6>
                                <div className="tweet-area">
                                    <textarea
                                        id="content"
                                        required
                                        name="content"
                                        cols="30"
                                        rows="10"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="content">
                                    <input
                                        className="btn btn-primary btn-bg-modified"
                                        value="Post"
                                        type="submit"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    <h1 className="mb-3 display-4">My posts</h1>

                    {isLoading ? (
                        <Loader />
                    ) : sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <div key={post.id} className="centered-items">
                                <Posts
                                    post={post}
                                    currentUser={currentUser}
                                    setShowComments={() =>
                                        setShowCommentsPostId(post.id)
                                    }
                                    setSelectedPost={posts}
                                    deleteOption={true}
                                    onDelete={handlePostDelete}
                                    onCommentAdded={handleCommentAdded}
                                />
                                {showCommentsPostId === post.id && (
                                    <Comments
                                        currentUser={currentUser}
                                        currentPost={post}
                                        setShowComments={() =>
                                            setShowCommentsPostId(null)
                                        }
                                        onCommentAdded={handleCommentAdded}
                                        onCommentDeleted={handleCommentDeleted}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="ml-2 mt-5">
                            <h4>You have no posts.</h4>
                        </div>
                    )}
                    <div className="post-counter">
                        {sortedPosts.length}/{posts.length} posts shown
                    </div>
                    {sortedPosts.length < posts.length && (
                        <div className="load-more" onClick={handleLoadMore}>
                            Load more...
                        </div>
                    )}

                    <div className="categories-section">
                        <h1 className="mb-3 display-4">My Categories</h1>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleCategoryDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    placeholder="New Category"
                                    required
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Add Category
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 24px;
                    font-weight: bold;
                }
                .post-counter {
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                    padding-bottom: 20px;
                }
                .load-more {
                    cursor: pointer;
                    color: blue;
                    text-decoration: underline;
                    font-weight: bold;
                    padding-bottom: 40px;
                }
                .load-more:hover {
                    color: darkblue;
                }
                .categories-section {
                    margin-top: 40px;
                    width: 80%;
                }
                .categories-section .table {
                    width: 100%;
                    margin-bottom: 20px;
                }
                .categories-section .input-group {
                    width: 100%;
                }
            `}</style>
        </>
    );
};

export default Community;
