import React, { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/Create.css";
import "../styles/Comments-legacy.css";
import Posts from "../components/Posts";
import Comments from "../components/Comments";
import CategoryBox from "../containers/CategoryBox";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext";
import { createPost, fetchUserPosts } from "../actions/actionMyPosts";
import { fetchAllData } from "../actions/actionAppContext";

const MyPosts = () => {
    const { user, categories, posts, setPosts } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [visiblePostsCount, setVisiblePostsCount] = useState(3);
    const [catArray, setCatArray] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const userPosts = await fetchUserPosts(user.id);
                setFilteredPosts(userPosts);
                setPosts(userPosts);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [user.id, setPosts]);

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
        setFilteredPosts(updatedPosts);
        setPosts(updatedPosts);
    };

    const handleCommentDeleted = (postId, commentId) => {
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter((comment) => comment.id !== commentId),
                };
            }
            return post;
        });
        setFilteredPosts(updatedPosts);
        setPosts(updatedPosts);
    };

    const sortedPosts = filteredPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const trimmedCatArray = catArray.map(category => ({ id: category.id }));
    
        const newPost = {
            creator: { id: user.id },
            isStudent: true, // Adjust this value as needed
            title: formData.get("question"),
            content: formData.get("content"),
            categories: trimmedCatArray,
        };
    
        if (!newPost.title || !newPost.content || newPost.categories.length === 0) {
            alert("Please fill all the fields and select at least one category.");
            return;
        }
    
        if (newPost.title.length > 99) {
            alert("Please be more concise with your question (max 100 characters).");
            return;
        }
    
        if (newPost.content.length > 999) {
            alert("The description limit is 1000 characters.");
            return;
        }
    
        try {
            setIsLoading(true);
            await createPost(newPost);
            const token = localStorage.getItem("token");
            const allData = await fetchAllData(token);
    
            setPosts(allData.posts);
            setFilteredPosts(allData.posts);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="filterContainer"></div>
            <div className="home-container">
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
                                    onDelete={(postId) => {
                                        const updatedPosts = posts.filter(p => p.id !== postId);
                                        setFilteredPosts(updatedPosts);
                                        setPosts(updatedPosts);
                                    }}
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
                        {sortedPosts.length}/{filteredPosts.length} posts shown
                    </div>
                    {sortedPosts.length < filteredPosts.length && (
                        <div className="load-more" onClick={handleLoadMore}>
                            Load more...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyPosts;
