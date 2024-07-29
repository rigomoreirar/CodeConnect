import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "../styles/Comments.css";
import { AppContext } from "../context/AppContext";

const Comments = ({
    currentPost,
    setShowComments,
    currentUser,
    onCommentAdded,
    onCommentDeleted,
}) => {
    const { user } = useContext(AppContext);
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
                        // Mocking the profile picture URL, update logic as needed
                        pictures[
                            comment.profile
                        ] = `path/to/profile-picture/${comment.profile}.png`;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            id: comments.length + 1, // Mocked ID, update with actual logic
            profile: currentUser.id,
            post: currentPost.id,
            content: e.target.elements.content.value,
        };

        setComments([...comments, newComment]);
        onCommentAdded(currentPost.id, newComment);
        e.target.elements.content.value = "";
        console.log("Comment added:", newComment);
    };

    const handleDelete = (commentId) => {
        const updatedComments = comments.filter(
            (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
        onCommentDeleted(currentPost.id, commentId);
        console.log("Comment deleted:", commentId);
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
                            {comment.profile === currentUser.id && (
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
