import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import styles from "../styles/ProfilePicture.module.css";
import {
    getProfilePicture,
    changeProfilePicture,
} from "../actions/actionProfilePicture";

const ProfilePicture = () => {
    const { user, profilePictureUrl, setProfilePictureUrl } =
        useContext(AppContext);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const profilePictureUrl = await getProfilePicture(user.id);
                setProfilePictureUrl(profilePictureUrl);
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };

        fetchProfilePicture();
    }, [user.id, setProfilePictureUrl]);

    const handleFileChange = async (event) => {
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
                "image/webp",
            ];
            if (!validExtensions.includes(file.type)) {
                setError("Invalid file type.");
                return;
            }

            setError("");
            try {
                // Upload the new profile picture
                await changeProfilePicture(file);

                // Fetch the processed profile picture from the server
                const updatedProfilePictureUrl = await getProfilePicture(
                    user.id
                );
                setProfilePictureUrl(updatedProfilePictureUrl);
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                setError("Error uploading profile picture.");
            }
        }
    };

    return (
        <div className={styles["profile-picture-container"]}>
            <div className={styles["profile-picture"]}>
                <img src={profilePictureUrl} alt="Profile" />
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
