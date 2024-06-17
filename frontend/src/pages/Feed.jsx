import { useEffect, useState } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "./Comments";
import Filters from "../containers/Filters";

import Axios from "axios";

const Feed = ({ currentUser, categories }) => {
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [post, setPost] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [allPosts, setAllPosts] = useState([]);

    const sortedPosts = posts.sort((a, b) => b.likes - a.likes);

    const fetchData = async () => {
        try {
            const response = await Axios.get("backend/all-posts/");
            const postArray = response.data;
            const newPosts = [];
            const newAllPosts = [];

            for (const post of postArray) {
                const postDataResponse = await Axios.post("backend/postData/", {
                    post_id: post.id,
                });

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
                    newAllPosts.push(newPost);
                }
            }

            setPosts(newPosts);
            setAllPosts(newAllPosts);
        } catch (error) {
            console.error(error);
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
        <div className="home-container">
            {!showComments && (
                <>
                    <Filters
                        categories={categories}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                    <div className="inner-main d-flex flex-column align-items-center">
                        <h1 className=" mt-2 ml-3 display-4">My Feed</h1>

                        {sortedPosts.length > 0 ? (
                            posts.map((post) => (
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
    );
};

export default Feed;
