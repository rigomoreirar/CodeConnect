import React, { useState } from "react";
import "../styles/RegisterProfilePicture.module.css";
import noProfilePicture from "../assets/no-profile-picture.webp";

const RegisterProfilePicture = ({ setProfilePicture }) => {
    const [preview, setPreview] = useState(noProfilePicture);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setProfilePicture(file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="picture-container">
            <h2>Profile Picture</h2>
            <div className="profile-picture">
                <img src={preview} alt="Profile" className="profile-image" />
                <label className="upload-button">
                    Select Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                </label>
            </div>
        </div>
    );
};

export default RegisterProfilePicture;
