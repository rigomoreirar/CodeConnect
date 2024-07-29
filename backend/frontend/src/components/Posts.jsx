import React, { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp, FaTrashAlt } from "react-icons/fa";
import "../styles/Posts.css";
import { AppContext } from "../context/AppContext";

const Posts = ({
    post,
    currentUser,
    setShowComments,
    setPost,
    deleteOption = false,
    onDelete,
    onCommentAdded,
}) => {
    const { user } = useContext(AppContext);
    const {
        content,
        title,
        likes = [],
        dislikes = [],
        comments = [],
        categories = [],
    } = post;
    const [likeFill, setLikeFill] = useState(false);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [dislikeFill, setDislikeFill] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(dislikes.length);
    const [currentPost, setCurrentPost] = useState(null);

    const updateLikesDislikes = (updatedLikes, updatedDislikes) => {
        const postLikes = updatedLikes.filter((like) => like.post === post.id);
        const postDislikes = updatedDislikes.filter(
            (dislike) => dislike.post === post.id
        );
        setLikeCount(postLikes.length);
        setLikeFill(postLikes.some((like) => like.profile === currentUser.id));
        setDislikeCount(postDislikes.length);
        setDislikeFill(
            postDislikes.some((dislike) => dislike.profile === currentUser.id)
        );
    };

    const likeHandler = async () => {
        try {
            if (!likeFill) {
                if (dislikeFill) {
                    setDislikeCount(dislikeCount - 1);
                    setDislikeFill(false);
                }
                setLikeCount(likeCount + 1);
                setLikeFill(true);
            } else {
                setLikeCount(likeCount - 1);
                setLikeFill(false);
            }
            console.log("Like handled for post:", post.id);
        } catch (error) {
            console.log(error);
        }
    };

    const dislikeHandler = async () => {
        try {
            if (!dislikeFill) {
                if (likeFill) {
                    setLikeCount(likeCount - 1);
                    setLikeFill(false);
                }
                setDislikeCount(dislikeCount + 1);
                setDislikeFill(true);
            } else {
                setDislikeCount(dislikeCount - 1);
                setDislikeFill(false);
            }
            console.log("Dislike handled for post:", post.id);
        } catch (error) {
            console.log(error);
        }
    };

    const commentsHandler = () => {
        setCurrentPost(post);
        setShowComments(true);
        setPost(post);
    };

    const deleteHandler = async () => {
        try {
            console.log("Post deleted:", post.id);
            onDelete(post.id);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        Array.isArray(likes) &&
            likes.forEach((like) => {
                if (like.profile === currentUser.id) {
                    setLikeFill(true);
                }
            });

        Array.isArray(dislikes) &&
            dislikes.forEach((dislike) => {
                if (dislike.profile === currentUser.id) {
                    setDislikeFill(true);
                }
            });
    }, [currentPost, currentUser, likes, dislikes]);

    return (
        <div
            style={{ maxWidth: "40rem" }}
            id="post-container"
            className="inner-main-body p-2 p-sm-3 forum-content show "
        >
            <div className="card mb-2" style={{ maxWidth: "40rem" }}>
                <div className="card-body p-2 p-sm-3">
                    <div className="d-flex flex-column">
                        {deleteOption && (
                            <FaTrashAlt
                                className="delete-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteHandler();
                                }}
                                style={{
                                    alignSelf: "flex-end",
                                    cursor: "pointer",
                                    color: "red",
                                }}
                            />
                        )}
                        <div className="media-body">
                            <div className="">
                                <h6 className="text-body">{title}</h6>
                                <section id="cats">
                                    {Array.isArray(categories) &&
                                        categories.map((category) => (
                                            <div key={category.id}>
                                                <span className="badge badge-secondary mr-2">
                                                    {category.name}
                                                </span>
                                            </div>
                                        ))}
                                </section>
                            </div>
                            <p>{content}</p>
                        </div>
                        <div className="text-muted small text-center align-self-center align-items-center">
                            <span
                                onClick={likeHandler}
                                className=" d-sm-inline-block"
                            >
                                {likeFill ? (
                                    <FaThumbsUp className="like" />
                                ) : (
                                    <FaThumbsUp className="none" />
                                )}
                                {likeCount}
                            </span>
                            <span
                                onClick={dislikeHandler}
                                className=" d-sm-inline-block ml-2"
                            >
                                {dislikeFill ? (
                                    <FaThumbsDown className="dislike" />
                                ) : (
                                    <FaThumbsDown className="none" />
                                )}
                                {dislikeCount}
                            </span>
                            <span onClick={commentsHandler}>
                                <button
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#exampleModalLong"
                                    style={{ border: "none" }}
                                >
                                    <i className="far fa-comment ml-2"></i>
                                    {comments.length}
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;
