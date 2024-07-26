import React, { useEffect, useState } from "react";
import axios from "../utils/Axios";
import { Link } from "react-router-dom";
import "../styles/EditProfile.css";

const EditProfile = ({ currentUser }) => {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username);
            setEmail(currentUser.email);
            setLastName(currentUser.last_name);
            setFirstName(currentUser.first_name);
        }
    }, [currentUser]);

    const handleSave = async () => {
        try {
            const response = await axios.post(
                "/edit-user-info/",
                {
                    username,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                },
                {
                    headers: {
                        Authorization: window.localStorage.getItem("token"),
                    },
                }
            );
            if (response.status === 200) {
                alert("Profile updated successfully");
            }
        } catch (error) {
            setError("Error updating profile: " + error.response.data.error);
            alert("Error updating profile: " + error.response.data.error);
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
                <h2 className="mb-5">Edit Profile</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="btn btn-primary">
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
