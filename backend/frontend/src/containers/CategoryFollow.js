import React from "react";
import Following from "../components/Following";
import "../styles/CategoryFollow.css";

const CategoryFollow = ({
    categories,
    currentUser,
    setLength,
    length,
    refreshUserData,
    onFollow,
    onUnfollow,
}) => {
    const categoryArray = Array.isArray(categories) ? categories : [];

    return (
        <div
            className="category-follow-card card"
            style={{
                width: "75vw",
                maxWidth: "700px",
                marginBottom: "2rem",
            }}
        >
            <div className="card-body">
                <p className="ml-1 mb-0">Available categories:</p>
                {categoryArray.map((category) => (
                    <Following
                        key={category.id}
                        setLength={setLength}
                        length={length}
                        currentUser={currentUser}
                        ctg_following={currentUser.profile_data.ctg_following}
                        category={category}
                        refreshUserData={refreshUserData}
                        onFollow={onFollow}
                        onUnfollow={onUnfollow}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryFollow;
