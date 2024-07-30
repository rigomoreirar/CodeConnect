import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { addComment, deleteComment, fetchProfilePicture } from "../actions/actionComments";
import defaultPicture from "../assets/no-profile-picture.webp";
import "../styles/Comments.css";

const Comments = ({ currentPost, setShowComments, currentUser, onCommentAdded, onCommentDeleted }) => {
    const { user } = useContext(AppContext);
    const [comments, setComments] = useState(Array.isArray(currentPost.comments) ? currentPost.comments : []);
    const [profilePictures, setProfilePictures] = useState({});

    useEffect(() => {
        const fetchProfilePictures = async () => {
            const pictures = {};
            for (const comment of comments) {
                if (!pictures[comment.profile]) {
                    try {
                        const pictureUrl = await fetchProfilePicture(comment.profile);
                        pictures[comment.profile] = pictureUrl;
                    } catch (error) {
                        console.error("Error fetching profile picture:", error);
                        pictures[comment.profile] = defaultPicture;
                    }
                }
            }
            setProfilePictures(pictures);
        };

        fetchProfilePictures();
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        try {
            const newComment = await addComment(currentPost.id, currentUser.id, content);
            setComments([...comments, newComment]);
            onCommentAdded(currentPost.id, newComment);
            e.target.elements.content.value = "";
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId, currentUser.id);
            const updatedComments = comments.filter((comment) => comment.id !== commentId);
            setComments(updatedComments);
            onCommentDeleted(currentPost.id, commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="comments-container">
            <div className="comments-header pb-4">
                <h5 className="modal-title mb-1" id="exampleModalLongTitle">Comments</h5>
                <button onClick={() => setShowComments(false)} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="comments-body pt-0">
                {comments.length < 1 && (
                    <strong><p>There are no comments yet.</p></strong>
                )}
                <form onSubmit={handleSubmit} className="mb-3" id="tweet-form">
                    <div className="input-box">
                        <div className="tweet-area">
                            <textarea id="content" required name="content" cols="30" rows="2"></textarea>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="content">
                            <input className="btn btn-secondary" value="Add comment" type="submit" />
                        </div>
                    </div>
                </form>
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                            <img src={profilePictures[comment.profile] || defaultPicture} alt="Profile" className="profile-picture" />
                            <h6 className="mb-0">{comment.profile}</h6>
                            {comment.profile === currentUser.username && (
                                <FaTrashAlt className="delete-icon" onClick={() => handleDelete(comment.id)} style={{ cursor: "pointer", color: "red" }} />
                            )}
                        </div>
                        <p className="mb-1 comment-content">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
