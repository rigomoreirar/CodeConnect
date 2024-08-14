import { useState, useContext } from "react";

import { AppContext } from "../context/AppContext";

import styles from "../styles/Home.module.css";

import Posts from "../components/Posts";
import Comments from "../components/Comments";
import Filters from "../containers/Filters";

const Home = () => {
    const { user, categories, posts, setPosts } = useContext(AppContext);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);
    const [visiblePostsCount, setVisiblePostsCount] = useState(15);

    const filteredPosts =
        activeFilter.length === 0
            ? posts
            : posts.filter((post) =>
                  post.categories.some((categoryId) =>
                      activeFilter.some((filter) => filter.id === categoryId)
                  )
              );

    const sortedPosts = filteredPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    const handleLoadMore = () => {
        setVisiblePostsCount((prevCount) => prevCount + 15);
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

    const handlePostDeleted = (postId) => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
    };

    return (
        <>
            <div className={styles["home-container"]}>
                <Filters
                    categories={Array.isArray(categories) ? categories : []}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    neededCategories={true}
                />
                <div
                    className={`inner-main d-flex flex-column align-items-center ${styles["centered-items"]}`}
                >
                    <h1 className={`ml-3 mt-3 display-4 ${styles.textCenter}`}>
                        Here's what's new!
                    </h1>
                    {sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <div
                                key={post.id}
                                className={styles["centered-items"]}
                            >
                                <Posts
                                    setPost={() => {}}
                                    showCommets={showCommentsPostId === post.id}
                                    setShowComments={() =>
                                        setShowCommentsPostId(post.id)
                                    }
                                    currentUser={user}
                                    post={post}
                                    onDelete={handlePostDeleted}
                                    onCommentAdded={handleCommentAdded}
                                    onCommentDeleted={handleCommentDeleted}
                                    location="/forum/home"
                                />
                                {showCommentsPostId === post.id && (
                                    <Comments
                                        key={post.id}
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
                        <div
                            className={`ml-2 mt-5 ${styles["centered-items"]}`}
                        >
                            <h1>Woops!</h1>
                            <h4 className={styles.textCenter}>
                                No posts found for this category!
                            </h4>
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

export default Home;
