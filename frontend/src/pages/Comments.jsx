import axios from "../utils/Axios";
import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "../styles/Comments.css";

// This is a test comment, delete me if you find me
const Comments = ({
    currentPost,
    setShowComments,
    currentUser,
    onCommentAdded,
    onCommentDeleted,
}) => {
    const [comments, setComments] = useState(
        Array.isArray(currentPost.comments) ? currentPost.comments : []
    );
    const [profilePictures, setProfilePictures] = useState({});

    useEffect(() => {
        const fetchProfilePictures = async () => {
            const pictures = {};
            for (const comment of comments) {
                if (!pictures[comment.profile]) {
                    try {
                        const response = await axios.get(
                            `http://localhost:8000/profile-picture-username/${comment.profile}/`
                        );
                        pictures[comment.profile] = response.config.url;
                    } catch (error) {
                        console.error("Error fetching profile picture:", error);
                        pictures[comment.profile] =
                            "path/to/default/profile-picture.png";
                    }
                }
            }
            setProfilePictures(pictures);
        };

        fetchProfilePictures();
    }, [comments]);

    const fetchComments = async () => {
        try {
            const response = await axios.post("postData/", {
                post_id: currentPost.id,
            });
            const newComments = Array.isArray(response.data.comments)
                ? response.data.comments
                : [];
            setComments(newComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        const eventSource = new EventSource("/sse/comments/");
        eventSource.onmessage = (event) => {
            try {
                const updatedComments = JSON.parse(event.data);
                if (
                    updatedComments.some(
                        (comment) => comment.post === currentPost.id
                    )
                ) {
                    fetchComments();
                }
            } catch (error) {
                console.error("Error parsing comments event data:", error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [currentPost]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            profile: currentUser.id,
            post: currentPost.id,
            content: e.target.elements.content.value,
        };
        axios
            .post("addComment/", newComment)
            .then((res) => {
                const createdComment = res.data;
                setComments([...comments, createdComment]);
                e.target.elements.content.value = "";
                onCommentAdded(currentPost.id, createdComment);
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });
    };

    const handleDelete = (commentId) => {
        axios
            .post("delete_comment/", {
                comment_id: commentId,
                user_id: currentUser.id,
            })
            .then((res) => {
                setComments(
                    comments.filter((comment) => comment.id !== commentId)
                );
                onCommentDeleted(currentPost.id, commentId);
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
            });
    };

    return (
        <div className="comments-container">
            <div className="comments-header pb-4">
                <h5 className="modal-title mb-1" id="exampleModalLongTitle">
                    Comments
                </h5>
                <button
                    onClick={() => setShowComments(false)}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="comments-body pt-0">
                {comments.length < 1 && (
                    <strong>
                        <p>There are no comments yet.</p>
                    </strong>
                )}
                <form onSubmit={handleSubmit} className="mb-3" id="tweet-form">
                    <div className="input-box">
                        <div className="tweet-area">
                            <textarea
                                id="content"
                                required
                                name="content"
                                cols="30"
                                rows="2"
                            ></textarea>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="content">
                            <input
                                className="btn btn-secondary"
                                value="Add comment"
                                type="submit"
                            />
                        </div>
                    </div>
                </form>
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                            <img
                                src={profilePictures[comment.profile]}
                                alt="Profile"
                                className="profile-picture"
                            />
                            <h6 className="mb-0">{comment.profile}</h6>
                            {comment.profile === currentUser.username && (
                                <FaTrashAlt
                                    className="delete-icon"
                                    onClick={() => handleDelete(comment.id)}
                                    style={{ cursor: "pointer", color: "red" }}
                                />
                            )}
                        </div>
                        <p className="mb-1 comment-content">
                            {comment.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
