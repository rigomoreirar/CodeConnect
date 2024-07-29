import { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/Create.css";
import "../styles/Comments-legacy.css";
import Posts from "../components/Posts";
import Comments from "../components/Comments";
import Filters from "../containers/Filters";
import CategoryBox from "../containers/CategoryBox";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext";

const Community = () => {
    const {
        user,
        categories,
        posts: allPosts,
        setPosts,
        setCategories,
    } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPostsState] = useState([]);
    const [userCategories, setUserCategories] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);
    const [visiblePostsCount, setVisiblePostsCount] = useState(3);
    const [catArray, setCatArray] = useState([]);

    useEffect(() => {
        setUserCategories(user.profile_data.ctg_following);
        setPostsState(allPosts.filter((post) => post.user_id === user.id));
        setIsLoading(false);
    }, [user, allPosts]);

    useEffect(() => {
        if (activeFilter.length === 0) {
            setPostsState(allPosts.filter((post) => post.user_id === user.id));
        } else {
            const filtered = allPosts.filter((post) =>
                activeFilter.some((filter) =>
                    post.categories.some(
                        (category) => category.name === filter.name
                    )
                )
            );
            setPostsState(filtered);
        }
    }, [activeFilter, allPosts, user.id]);

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
        setPostsState(updatedPosts);
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
        setPostsState(updatedPosts);
        setPosts(updatedPosts);
    };

    const sortedPosts = posts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPost = {
            id: posts.length + 1,
            user_id: user.id,
            title: formData.get("question"),
            content: formData.get("content"),
            categories: catArray,
            likes: [],
            dislikes: [],
            comments: [],
        };

        if (
            !newPost.title ||
            !newPost.content ||
            newPost.categories.length === 0
        ) {
            alert(
                "Please fill all the fields and select at least one category."
            );
            return;
        }

        if (newPost.title.length > 99) {
            alert(
                "Please be more concise with your question (max 100 characters)."
            );
            return;
        }

        if (newPost.content.length > 999) {
            alert("The description limit is 1000 characters.");
            return;
        }

        setPosts([...posts, newPost]);
        setPostsState([...posts, newPost]);
        console.log("New Post Added:", newPost);
    };

    const handlePostDelete = (postId) => {
        setPostsState((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
        );
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        console.log(`Post deleted: ${postId}`);
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryName = formData.get("category");

        const newCategory = { id: categories.length + 1, name: categoryName };

        setCategories([...categories, newCategory]);
        setUserCategories([...userCategories, newCategory]);
        console.log("Category created:", categoryName);
    };

    const handleCategoryDelete = (categoryId) => {
        const updatedCategories = categories.filter(
            (category) => category.id !== categoryId
        );
        const updatedUserCategories = userCategories.filter(
            (category) => category.id !== categoryId
        );

        setCategories(updatedCategories);
        setUserCategories(updatedUserCategories);
        console.log(`Category deleted: ${categoryId}`);
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
                        Welcome back, {user.first_name}
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
                                    currentUser={user}
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
                                        currentUser={user}
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
