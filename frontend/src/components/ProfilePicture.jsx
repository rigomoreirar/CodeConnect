import React, { useState } from "react";
import axios from "../utils/Axios";
import styles from "../styles/ProfilePicture.module.css";

const ProfilePicture = ({ userId, imageUrl, setImageUrl, refreshProfile }) => {
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
            if (!validExtensions.includes(file.type)) {
                setError(
                    "Invalid file type. Only PNG, JPG, and JPEG are allowed."
                );
                return;
            }

            setError("");
            const formData = new FormData();
            formData.append("profile_picture", file);

            try {
                const token = window.localStorage.getItem("token");
                if (!token) return;

                await axios.post("change-profile-picture/", formData, {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                });

                setImageUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        }
    };

    return (
        <div className={styles["profile-picture-container"]}>
            <div className={styles["profile-picture"]}>
                <img src={imageUrl} alt="Profile" />
                <label className={styles["upload-button"]}>
                    Change Profile Picture
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>
                {error && <p className={styles["error-message"]}>{error}</p>}
            </div>
        </div>
    );
};

export default ProfilePicture;
