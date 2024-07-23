import axios from "axios";
import React from "react";
import { useState } from "react";
import "../styles/Comments.css";

const Comments = ({ currentPost, setShowComments, currentUser }) => {
    const [comments, setComments] = useState(
        Array.isArray(currentPost.comments) ? currentPost.comments : []
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const renderComment = {
            id: new Date().getTime().toString(),
            profile: currentUser.username,
            post: currentPost,
            content: e.target.elements.content.value,
        };
        const newComment = {
            id: new Date().getTime().toString(),
            profile: currentUser,
            post: currentPost,
            content: e.target.elements.content.value,
        };
        axios.post("/backend/addComment/", newComment).then((res) => {
            setComments([...comments, renderComment]);
            e.target.elements.content.value = "";
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
                {comments.map((comment) => {
                    return (
                        <div key={comment.id}>
                            <h6 className="mb-0">{comment.profile}</h6>
                            <p className="mb-1">{comment.content}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Comments;
