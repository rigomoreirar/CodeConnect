import { useEffect, useState } from "react";
import Axios from "axios";
import "../styles/Home.css";
import "../styles/Create.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";
import CategoryBox from "../containers/CategoryBox";
import Loader from "../components/Loader";

const Community = ({
    currentUser,
    categories,
    catArray,
    setCatArray,
    setLoggedUser,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeFilter, setActiveFilter] = useState([]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                "http://localhost:8000/all-posts/"
            );
            const fetchedPosts = response.data.map(async (post) => {
                try {
                    const postDetailsResponse = await Axios.post(
                        "http://localhost:8000/postData/",
                        { post_id: post.id }
                    );
                    return { ...post, ...postDetailsResponse.data };
                } catch (error) {
                    console.error("Error fetching post details:", error);
                    return post; // Return the post without details in case of error
                }
            });
            Promise.all(fetchedPosts).then((postsWithDetails) => {
                setPosts(postsWithDetails.filter((post) => post.isStudent));
                setIsLoading(false);
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [currentUser]);

    useEffect(() => {
        const filterPosts = () => {
            if (activeFilter.length === 0) {
                setPosts(posts);
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
    }, [activeFilter, posts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const post = {
            isStudent: true,
            creator: currentUser,
            question: formData.get("question"),
            content: formData.get("content"),
            categories: catArray,
        };

        if (!post.question || !post.content || post.categories.length === 0) {
            alert(
                "Please fill all the fields and select at least one category."
            );
            return;
        }

        if (post.question.length > 99) {
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
            const response = await Axios.post(
                "http://localhost:8000/new-post/",
                post
            );
            console.log("New Post Response:", response.data);
            fetchPosts(); // Fetch the latest posts after creating a new one
        } catch (error) {
            console.error("Error creating new post:", error);
        }
    };

    return (
        <>
            <div className="home-container">
                {!showComments ? (
                    <>
                        <Filters
                            categories={categories}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                        />
                        <div className="inner-main d-flex flex-column align-items-center">
                            <h1 className="ml-3 mt-3 display-4">
                                Welcome back, {currentUser.first_name}
                            </h1>
                            <form onSubmit={handleSubmit} id="tweet-form">
                                <div id="tweetbox" className="wrapper mb-5">
                                    <div className="input-box">
                                        <h6>What's your question?</h6>
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
                                        <h6>Detail your question!</h6>
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
                            {isLoading ? (
                                <Loader />
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <Posts
                                        key={post.id}
                                        post={post}
                                        currentUser={currentUser}
                                        setShowComments={setShowComments}
                                        setSelectedPost={setSelectedPost}
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
                ) : (
                    <Comments
                        currentUser={currentUser}
                        currentPost={selectedPost}
                        setShowComments={setShowComments}
                    />
                )}
            </div>
        </>
    );
};

export default Community;
