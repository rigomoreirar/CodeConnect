import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import Axios from "axios";

const Feed = ({ currentUser, categories, setLoggedUser }) => {
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [post, setPost] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sort posts by id in descending order
    const sortedPosts = posts.sort((a, b) => b.id - a.id);

    const fetchData = async () => {
        try {
            const response = await Axios.get(
                "http://localhost:8000/all-posts/"
            );
            const postArray = response.data;

            const newPosts = [];
            const newAllPosts = [];

            for (const post of postArray) {
                const postDataResponse = await Axios.post(
                    "http://localhost:8000/postData/",
                    { post_id: post.id }
                );

                let newPost = {
                    ...post,
                    likes: postDataResponse.data.likes,
                    dislikes: postDataResponse.data.dislikes,
                    comments: postDataResponse.data.comments,
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
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error(error);
            setLoading(false); // Set loading to false even if there's an error
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

    return (
        <>
            <div className="home-container">
                {!showComments && (
                    <>
                        <Filters
                            categories={categories}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                        />
                        <div className="inner-main d-flex flex-column align-items-center">
                            <h1 className="mt-2 ml-3 display-4">My Feed</h1>

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
                                <div className="ml-2 mt-5 text-holder-no-categories">
                                    <h1>Woops!</h1>
                                    <h4>You haven't followed any category!</h4>
                                    <p>
                                        To follow a category go to{" "}
                                        <em>
                                            <b>My Profile</b>
                                        </em>
                                        , then click on{" "}
                                        <em>
                                            <b>Categories</b>
                                        </em>{" "}
                                        tab and select your favorite topics.
                                    </p>
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

export default Feed;
