import React, { useState, useEffect, useContext } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AppContext } from "../context/AppContext";

const Following = ({ category, ctg_following, setLength, refreshUserData, onFollow, onUnfollow }) => {
    const { user, setUser } = useContext(AppContext);
    const [isFollowing, setIsFollowing] = useState(
        ctg_following.some((catId) => catId === category.id)
    );

    useEffect(() => {
        setIsFollowing(ctg_following.some((catId) => catId === category.id));
    }, [ctg_following, category.id]);

    const handleCat = async () => {
        try {
            if (isFollowing) {
                await onUnfollow(category.id);
                setIsFollowing(false);
                setLength((prevLength) => prevLength - 1);
                const updatedUser = {
                    ...user,
                    profile_data: {
                        ...user.profile_data,
                        ctg_following: user.profile_data.ctg_following.filter(catId => catId !== category.id)
                    }
                };
                setUser(updatedUser);
            } else {
                await onFollow(category.id);
                setIsFollowing(true);
                setLength((prevLength) => prevLength + 1);
                const updatedUser = {
                    ...user,
                    profile_data: {
                        ...user.profile_data,
                        ctg_following: [...user.profile_data.ctg_following, category.id]
                    }
                };
                setUser(updatedUser);
            }
            refreshUserData();
        } catch (error) {
            console.error("Error updating category follow status:", error);
        }
    };

    return (
        <div
            onClick={handleCat}
            className="hover justify-content-center"
            key={category.id}
            style={{ padding: "1em", border: "solid" }}
        >
            {category.name}
            <AiFillCheckCircle
                className="ml-2"
                style={isFollowing ? { fill: "green" } : { fill: "lightgrey" }}
            />
        </div>
    );
};

export default Following;
