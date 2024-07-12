import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import Axios from "axios";

const Home = ({ currentUser, categories, setLoggedUser }) => {
    const [posts, setPosts] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [post, setPost] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePostsCount, setVisiblePostsCount] = useState(15);

    const fetchData = async () => {
        try {
            const response = await Axios.get(
                "http://localhost:8000/all-posts/"
            );
            const postArray = response.data;
            const enrichedPosts = await Promise.all(
                postArray.map(async (post) => {
                    try {
                        const res = await Axios.post(
                            "http://localhost:8000/postData/",
                            { post_id: post.id }
                        );
                        return {
                            ...post,
                            likes: res.data.likes,
                            dislikes: res.data.dislikes,
                            comments: res.data.comments,
                        };
                    } catch (error) {
                        console.error("Error fetching post data:", error);
                        return post;
                    }
                })
            );

            setAllPosts(enrichedPosts);
            setPosts(enrichedPosts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        if (activeFilter.length === 0) {
            setPosts(allPosts);
        } else if (activeFilter.length === 1) {
            const filteredPosts = allPosts.filter((post) =>
                post.categories.includes(activeFilter[0].name)
            );
            setPosts(filteredPosts);
        }
    }, [activeFilter, allPosts]);

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
                    categories={categories}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    neededCategories={true}
                />
                <div className="inner-main d-flex flex-column align-items-center">
                    <h1 className="ml-3 mt-3 display-4">Here's what's new!</h1>
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <div key={post.id} className="centered-items">
                                <Posts
                                    setPost={setPost}
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
                        <div className="ml-2 mt-5 centered-items">
                            <h1>Woops!</h1>
                            <h4>No posts found for this category!</h4>
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

export default Home;
