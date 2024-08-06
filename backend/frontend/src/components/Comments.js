import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";

import { AppContext } from "../context/AppContext";

import styles from "../styles/Comments.module.css";

import defaultPicture from "../assets/no-profile-picture.webp";

import { addComment, deleteComment, fetchProfilePicture } from "../actions/actionComments";

const Comments = ({ currentPost, setShowComments, currentUser, onCommentAdded, onCommentDeleted }) => {
    const { posts } = useContext(AppContext);
    const [comments, setComments] = useState([]);

    const [profilePictures, setProfilePictures] = useState({});

    useEffect(() => {
        // Update comments based on the latest post data from the context
        const updatedPost = posts.find(post => post.id === currentPost.id);
        if (updatedPost) {
            setComments(updatedPost.comments);
        }
    }, [posts, currentPost.id]);

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
            onCommentAdded(currentPost.id, newComment);
            e.target.elements.content.value = "";
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId, currentUser.id);
            onCommentDeleted(currentPost.id, commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className={styles["comments-container"]}>
            <div className={styles["comment-header"]}>
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
                    <div key={comment.id} className={styles["comment-item"]}>
                        <div className={styles["comment-header"]}>
                            <div className={styles["first-part-comment-header"]}>

                            <img src={profilePictures[comment.profile] || defaultPicture} alt="Profile" className={styles["profile-picture"]} />
                            
                            <h6 className="mt-2">{comment.profile}</h6>
                            </div>
                            <div>
                            {comment.profile === currentUser.username && (
                                <FaTrashAlt className="delete-icon" onClick={() => handleDelete(comment.id)} style={{ cursor: "pointer", color: "red" }} />
                            )}
                            </div>
                        </div>
                        <p className={styles["comment-content"]}>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
