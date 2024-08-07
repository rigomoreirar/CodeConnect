import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { changeUserPassword } from "../actions/actionNewPassword";

import styles from "../styles/EditProfileNewPassword.module.css";

const NewPassword = () => {
    const { user } = useContext(AppContext);
    const [error, setError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSave = async () => {
        if (!currentPassword || !newPassword) {
            setError("Both fields are required.");
            return;
        }

        try {
            const response = await changeUserPassword(currentPassword, newPassword);
            if (response.message) {
                alert("Password updated successfully");
                setError("");
            } else {
                throw new Error(response.error || "Error updating password");
            }
        } catch (error) {
            setError("Error updating password: " + error.message);
            alert("Error updating password: " + error.message);
        }
    };

    return (
        <>
        {/* <div className="filterContainer"></div> */}
        <div className={styles["centering-div"]}>
            <div className={styles["container-edit-profile"]}>
                <div className={styles["back-start-container"]}>
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
        </>
    );
};

export default NewPassword;
