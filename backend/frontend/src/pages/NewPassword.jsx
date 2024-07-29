import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "../styles/EditProfile.css";

const NewPassword = () => {
    const { user } = useContext(AppContext);
    const [error, setError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSave = () => {
        if (!currentPassword || !newPassword) {
            setError("Both fields are required.");
            return;
        }

        // Simulating password change
        if (currentPassword === "correct_password") {
            alert("Password updated successfully");
            setError("");
        } else {
            setError("Error updating password: Incorrect current password.");
            alert("Error updating password: Incorrect current password.");
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
