import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import Axios from "axios";

const Home = ({ currentUser, categories, setLoggedUser }) => {
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [post, setPost] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    // Sort posts by id in descending order and limit to the latest 15
    const sortedPosts = posts.sort((a, b) => b.id - a.id).slice(0, 15);

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
                        return post; // Fallback to original post if error
                    }
                })
            );

            setAllPosts(enrichedPosts);
            setPosts(enrichedPosts);
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false); // Set loading to false even if there's an error
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

    return (
        <>
            <div className="home-container">
                {!showComments && (
                    <>
                        <Filters
                            categories={categories}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                            neededCategories={true}
                        />
                        <div className="inner-main d-flex flex-column align-items-center">
                            <h1 className="ml-3 mt-3 display-4">
                                Here's what's new!
                            </h1>
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : sortedPosts.length > 0 ? (
                                sortedPosts.map((post) => (
                                    <Posts
                                        setPost={setPost}
                                        showCommets={showComments}
                                        setShowComments={setShowComments}
                                        currentUser={currentUser}
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                            ) : (
                                <div className="ml-2 mt-5">
                                    <h1>Woops!</h1>
                                    <h4>No posts found!</h4>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {showComments && (
                    <Comments
                        currentUser={currentUser}
                        currentPost={post}
                        setShowComments={setShowComments}
                    />
                )}
            </div>
            <style jsx>{`
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 24px;
                    font-weight: bold;
                }
            `}</style>
        </>
    );
};

export default Home;
