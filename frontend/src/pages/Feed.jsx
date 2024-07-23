import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import Axios from "axios";

const Feed = ({ currentUser, categories, setLoggedUser }) => {
    const [posts, setPosts] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePostsCount, setVisiblePostsCount] = useState(15);

    const fetchData = async () => {
        try {
            const response = await Axios.get(
                "http://localhost:8000/all-posts/"
            );
            const postArray = Array.isArray(response.data) ? response.data : [];

            const newPosts = [];
            const newAllPosts = [];

            for (const post of postArray) {
                const postDataResponse = await Axios.post(
                    "http://localhost:8000/postData/",
                    {
                        post_id: post.id,
                    }
                );

                let newPost = {
                    ...post,
                    likes: Array.isArray(postDataResponse.data.likes)
                        ? postDataResponse.data.likes
                        : [],
                    dislikes: Array.isArray(postDataResponse.data.dislikes)
                        ? postDataResponse.data.dislikes
                        : [],
                    comments: Array.isArray(postDataResponse.data.comments)
                        ? postDataResponse.data.comments
                        : [],
                };

                if (
                    !newPost.isStudent &&
                    newPost.categories.some((category) =>
                        currentUser.profile_data.ctg_following.includes(
                            category
                        )
                    )
                ) {
                    newPosts.push(newPost);
                }
                newAllPosts.push(newPost);
            }

            setPosts(newPosts);
            setAllPosts(newAllPosts);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
                                    showCommets={showCommentsPostId === post.id}
                                    setShowComments={() =>
                                        setShowCommentsPostId(post.id)
                                    }
                                    currentUser={currentUser}
                                    post={post}
                                />
                                {showCommentsPostId === post.id && (
                                    <Comments
                                        currentUser={currentUser}
                                        currentPost={post}
                                        setShowComments={() =>
                                            setShowCommentsPostId(null)
                                        }
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
            `}</style>
        </>
    );
};

export default Feed;
