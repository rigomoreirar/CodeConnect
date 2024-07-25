import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import Axios from "../utils/Axios";

const Feed = ({ currentUser, categories, setLoggedUser }) => {
    const [posts, setPosts] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePostsCount, setVisiblePostsCount] = useState(15);

    const fetchData = async () => {
        try {
            const response = await Axios.get("all-posts/");
            const postArray = Array.isArray(response.data) ? response.data : [];

            const enrichedPosts = await Promise.all(
                postArray.map(async (post) => {
                    try {
                        const res = await Axios.post("postData/", {
                            post_id: post.id,
                        });
                        return {
                            ...post,
                            likes: Array.isArray(res.data.likes)
                                ? res.data.likes
                                : [],
                            dislikes: Array.isArray(res.data.dislikes)
                                ? res.data.dislikes
                                : [],
                            comments: Array.isArray(res.data.comments)
                                ? res.data.comments
                                : [],
                        };
                    } catch (error) {
                        console.error("Error fetching post data:", error);
                        return post;
                    }
                })
            );

            setPosts(enrichedPosts);
            setAllPosts(enrichedPosts);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const postsEventSource = new EventSource("/sse/posts/");
        postsEventSource.onmessage = (event) => {
            try {
                console.log("Posts event data:", event.data);
                const updatedPosts = JSON.parse(event.data);
                setAllPosts(updatedPosts);
                setPosts(updatedPosts);
            } catch (error) {
                console.error("Error parsing posts event data:", error);
            }
        };

        const likesEventSource = new EventSource("/sse/likes/");
        likesEventSource.onmessage = (event) => {
            try {
                console.log("Likes event data:", event.data);
                const updatedLikes = JSON.parse(event.data);
                setPosts((prevPosts) =>
                    prevPosts.map((post) => ({
                        ...post,
                        likes: updatedLikes.filter(
                            (like) => like.post === post.id
                        ),
                    }))
                );
            } catch (error) {
                console.error("Error parsing likes event data:", error);
            }
        };

        const dislikesEventSource = new EventSource("/sse/dislikes/");
        dislikesEventSource.onmessage = (event) => {
            try {
                console.log("Dislikes event data:", event.data);
                const updatedDislikes = JSON.parse(event.data);
                setPosts((prevPosts) =>
                    prevPosts.map((post) => ({
                        ...post,
                        dislikes: updatedDislikes.filter(
                            (dislike) => dislike.post === post.id
                        ),
                    }))
                );
            } catch (error) {
                console.error("Error parsing dislikes event data:", error);
            }
        };

        return () => {
            postsEventSource.close();
            likesEventSource.close();
            dislikesEventSource.close();
        };
    }, [currentUser]);

    useEffect(() => {
        if (activeFilter.length === 0) {
            setPosts(
                allPosts.filter((post) =>
                    post.categories.some((category) =>
                        currentUser.profile_data.ctg_following.includes(
                            category
                        )
                    )
                )
            );
        } else if (activeFilter.length === 1) {
            const filteredPosts = allPosts.filter(
                (post) =>
                    post.categories.includes(activeFilter[0].name) &&
                    post.categories.some((category) =>
                        currentUser.profile_data.ctg_following.includes(
                            category
                        )
                    )
            );
            setPosts(filteredPosts);
        }
    }, [activeFilter, allPosts, currentUser]);

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
        setAllPosts(updatedPosts);
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
        setAllPosts(updatedPosts);
    };

    const sortedPosts = posts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    return (
        <>
            <div className="home-container">
                <Filters
                    categories={Array.isArray(categories) ? categories : []}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
                <div className="inner-main d-flex flex-column align-items-center">
                    <h1 className="mt-2 ml-3 display-4">My Feed</h1>

                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <div key={post.id} className="centered-items">
                                <Posts
                                    setPost={posts}
                                    showComments={
                                        showCommentsPostId === post.id
                                    }
                                    setShowComments={() =>
                                        setShowCommentsPostId(post.id)
                                    }
                                    currentUser={currentUser}
                                    post={post}
                                    onCommentAdded={handleCommentAdded}
                                    deleteOption={
                                        post.user_id === currentUser.id // Only show delete option if the post belongs to the current user
                                    }
                                    onDelete={(postId) => {
                                        setPosts(
                                            posts.filter((p) => p.id !== postId)
                                        );
                                        setAllPosts(
                                            allPosts.filter(
                                                (p) => p.id !== postId
                                            )
                                        );
                                    }}
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
                        <div className="ml-2 mt-5 text-holder-no-categories">
                            <h1>Woops!</h1>
                            <h4>There are no posts for your feed!</h4>
                            <div className="text-holder-no-categories-second">
                                <p>
                                    Check{" "}
                                    <em>
                                        <b>Home</b>
                                    </em>{" "}
                                    page, then go to{" "}
                                    <em>
                                        <b>My Profile</b>
                                    </em>
                                    ,
                                </p>

                                <p>
                                    {" "}
                                    and click on{" "}
                                    <em>
                                        <b>Categories</b>
                                    </em>{" "}
                                    tab and select your favorite topics.
                                </p>
                            </div>
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
                    margin-bottom: 8rem;
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
                }`}</style>
        </>
    );
};

export default Feed;
