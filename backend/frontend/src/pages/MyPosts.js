import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import styles from "../styles/MyPosts.module.css";

import Posts from "../components/Posts";
import Comments from "../components/Comments";
import CategoryBox from "../containers/CategoryBox";
import Loader from "../components/Loader";
import Filters from "../containers/Filters";
import { createPost } from "../actions/actionMyPosts";

const MyPosts = () => {
    const { user, posts, setPosts } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [visiblePostsCount, setVisiblePostsCount] = useState(3);
    const [catArray, setCatArray] = useState([]);

    useEffect(() => {
        // Filter posts based on the current user's ID
        const userPosts = posts.filter((post) => post.creator === user.id);
        setFilteredPosts(userPosts);
    }, [posts, user.id]);

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
                    comments: post.comments.filter(
                        (comment) => comment.id !== commentId
                    ),
                };
            }
            return post;
        });
        setFilteredPosts(updatedPosts);
        setPosts(updatedPosts);
    };

    const handlePostDeleted = (postId) => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setFilteredPosts(updatedPosts);
        setPosts(updatedPosts);
    };

    const sortedPosts = filteredPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const trimmedCatArray = catArray.map((category) => ({
            id: category.id,
        }));

        const newPost = {
            creator: { id: user.id },
            isStudent: true, // Adjust this value as needed
            title: formData.get("question"),
            content: formData.get("content"),
            categories: trimmedCatArray,
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

        try {
            setIsLoading(true);
            await createPost(newPost);
            // The new post will be added to the context automatically via SSE or context update
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Filters
                activeFilter={true}
                setActiveFilter={true}
                neededCategories={false}
            />
            <div className={styles.filterContainer}></div>
            <div className={styles.homeContainer}>
                <div
                    className={`${styles.innerMain} d-flex flex-column align-items-center`}
                >
                    <h1
                        className={`mb-4 ml-3 mt-3 display-4 ${styles.alignTextCenter}`}
                    >
                        Welcome back, {user.first_name}
                    </h1>
                    <form onSubmit={handleSubmit} id="tweet-form">
                        <div id="tweetbox" className={`${styles.wrapper} mb-5`}>
                            <div className={styles.inputBox}>
                                <h6>What's on your mind?</h6>
                                <input
                                    className={`${styles.question} mb-2`}
                                    type="text"
                                    name="question"
                                />
                                <CategoryBox
                                    catArray={catArray}
                                    setCatArray={setCatArray}
                                />
                                <h6>Detail your post!</h6>
                                <div className={styles.tweetArea}>
                                    <textarea
                                        id="content"
                                        required
                                        name="content"
                                        cols="30"
                                        rows="10"
                                    ></textarea>
                                </div>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.content}>
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
                            <div key={post.id} className={styles.centeredItems}>
                                <Posts
                                    post={post}
                                    currentUser={user}
                                    setShowComments={() =>
                                        setShowCommentsPostId(post.id)
                                    }
                                    setSelectedPost={posts}
                                    deleteOption={true}
                                    onDelete={handlePostDeleted}
                                    onCommentAdded={handleCommentAdded}
                                    location="/forum/my-posts"
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
                    <div className={styles["post-counter"]}>
                        {sortedPosts.length}/{filteredPosts.length} posts shown
                    </div>
                    {sortedPosts.length < filteredPosts.length && (
                        <div
                            className={styles["load-more"]}
                            onClick={handleLoadMore}
                        >
                            Load more...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyPosts;
