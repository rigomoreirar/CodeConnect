import React from "react";
import "../styles/ProfilePicture.module.css";

const ProfilePicture = ({ userId }) => {
    const imageUrl = `http://localhost:8000/profile-picture/${userId}/`;

    return <img src={imageUrl} alt="Profile" className="profile-img" />;
};

export default ProfilePicture;
