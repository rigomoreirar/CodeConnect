import React, { useState } from "react";
import styles from "../styles/RegisterProfilePicture.module.css";
import noProfilePicture from "../assets/no-profile-picture.webp";

const RegisterProfilePicture = ({ setProfilePicture }) => {
    const [preview, setPreview] = useState(noProfilePicture);
    const [error, setError] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/heic",
                "image/heif",
                "image/bmp",
                "image/tiff",
                "image/webp"
            ];
            if (!validExtensions.includes(file.type)) {
                setError(
                    "Invalid file type. Only PNG, JPG, and JPEG are allowed."
                );
                return;
            }

            setError("");
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setProfilePicture(file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.pictureContainer}>
            <h2>Profile Picture</h2>
            <div className={styles.profilePicture}>
                <img
                    src={preview}
                    alt="Profile"
                    className={styles.profileImage}
                />
                <label className={styles.uploadButton}>
                    Select Image
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                    />
                </label>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default RegisterProfilePicture;
