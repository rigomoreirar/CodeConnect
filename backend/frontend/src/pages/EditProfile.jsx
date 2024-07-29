import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/EditProfile.css";
import { AppContext } from "../context/AppContext";

const EditProfile = () => {
    const { user, setUser } = useContext(AppContext);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setLastName(user.last_name);
            setFirstName(user.first_name);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const updatedUser = {
                ...user,
                username,
                email,
                first_name: firstName,
                last_name: lastName,
            };
            // Simulate a successful update with a console log
            console.log("Profile updated:", updatedUser);

            // Update the user in the context
            setUser(updatedUser);

            alert("Profile updated successfully");
        } catch (error) {
            setError("Error updating profile: " + error.message);
            alert("Error updating profile: " + error.message);
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
