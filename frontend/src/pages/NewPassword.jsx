import React, { useState } from "react";
import axios from "../utils/Axios";
import { Link } from "react-router-dom";
import "../styles/EditProfile.css";

const NewPassword = () => {
    const [error, setError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSave = async () => {
        try {
            const response = await axios.post(
                "/change-user-password/",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: window.localStorage.getItem("token"),
                    },
                }
            );
            if (response.status === 200) {
                alert("Password updated successfully");
            }
        } catch (error) {
            setError("Error updating password: " + error.response.data.error);
            alert("Error updating password: " + error.response.data.error);
        }
    };

    return (
        <div className="centering-div">
            <div className="container-edit-profile">
                <div className="back-start-container">
                    <Link
                        to="/forum/profile"
                        className="back-start btn btn-secondary ml-2"
                    >
                        Back
                    </Link>
                </div>
                <h2 className="mb-5">Change Password</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="btn btn-primary">
                    Save
                </button>
            </div>
        </div>
    );
};

export default NewPassword;
