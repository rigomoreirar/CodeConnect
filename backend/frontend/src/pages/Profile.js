import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import CategoryFollow from "../containers/CategoryFollow";
import "../styles/Profile.css";
import ProfilePicture from "../components/ProfilePicture";
import Filters from "../containers/Filters";
import { followCategory, unfollowCategory } from "../actions/actionProfile";

const Profile = () => {
    const { user, categories, posts, profilePictureUrl, setProfilePictureUrl, setUser } = useContext(AppContext);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalDislikes, setTotalDislikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [ctgFollowingLength, setCtgFollowingLength] = useState(0);

    useEffect(() => {
        if (user && posts) {
            const userPosts = posts.filter(post => post.creator === user.id);
            const likes = userPosts.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
            const dislikes = userPosts.reduce((acc, post) => acc + (post.dislikes ? post.dislikes.length : 0), 0);
            const comments = posts.reduce((acc, post) => acc + post.comments.filter(comment => comment.profile === user.username).length, 0);

            setTotalLikes(likes);
            setTotalDislikes(dislikes);
            setTotalComments(comments);
            setCtgFollowingLength(user.profile_data.ctg_following.length);
        }
    }, [user, posts]);

    const handleFollowCategory = async (categoryId) => {
        try {
            await followCategory(categoryId, user.id);
            const updatedUser = {
                ...user,
                profile_data: {
                    ...user.profile_data,
                    ctg_following: [...user.profile_data.ctg_following, categoryId]
                }
            };
            setUser(updatedUser);
            setCtgFollowingLength(prevLength => prevLength + 1);
        } catch (error) {
            console.error("Error following category:", error);
        }
    };

    const handleUnfollowCategory = async (categoryId) => {
        try {
            await unfollowCategory(categoryId, user.id);
            const updatedUser = {
                ...user,
                profile_data: {
                    ...user.profile_data,
                    ctg_following: user.profile_data.ctg_following.filter(catId => catId !== categoryId)
                }
            };
            setUser(updatedUser);
            setCtgFollowingLength(prevLength => prevLength - 1);
        } catch (error) {
            console.error("Error unfollowing category:", error);
        }
    };

    const refreshUserData = () => {
        setTotalLikes(user.total_likes);
        setTotalDislikes(user.total_dislikes);
        setTotalComments(user.total_comments);
        setCtgFollowingLength(user.profile_data.ctg_following.length);
    };

    const email = user?.email || "";
    const first_name = user?.first_name || "";
    const last_name = user?.last_name || "";
    const username = user?.username || "";

    return (
        <>
            <Filters
                categories={categories}
                activeFilter={true}
                setActiveFilter={true}
                neededCategories={false}
            />
            <div className="d-flex flex-column align-items-center">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="container mb-5">
                        <div className="row no-gutters">
                            <div className="col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                                <ProfilePicture
                                    userId={user.id}
                                    imageUrl={profilePictureUrl}
                                    setImageUrl={setProfilePictureUrl}
                                    refreshProfile={refreshUserData}
                                />
                            </div>
                            <div className="col-md-8 col-lg-8">
                                <div className="d-flex flex-column">
                                    <div className="d-flex justify-content-center">
                                        <div className="d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white name-username-container">
                                            <h3 className="display-5">
                                                {first_name} {last_name}
                                            </h3>
                                            <h5>@{username}</h5>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <div className="p-3 bg-black text-white email-container-profile">
                                            <div>
                                                <h6>{email}</h6>
                                            </div>
                                            <div className="d-flex flex-row justify-content-between change-profile-buttons">
                                                <Link
                                                    to="/forum/edit-profile"
                                                    className="btn btn-primary mr-2"
                                                >
                                                    Edit Profile
                                                </Link>
                                                <Link
                                                    to="/forum/new-password"
                                                    className="btn btn-secondary"
                                                >
                                                    Reset Password
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="skill-block-container">
                                        <InfoBlock
                                            color="bg-success"
                                            title="Likes"
                                            count={totalLikes}
                                        />
                                        <InfoBlock
                                            color="bg-secondary"
                                            title="Comments"
                                            count={totalComments}
                                        />
                                        <InfoBlock
                                            color="bg-danger"
                                            title="Dislikes"
                                            count={totalDislikes}
                                        />
                                        <div
                                            onClick={() => setModal(!modal)}
                                            className="hover p-4 bg-dark text-center skill-block ctg-following"
                                        >
                                            <h4>{ctgFollowingLength}</h4>
                                            <h6>Categories</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {modal && (
                    <CategoryFollow
                        setLength={setCtgFollowingLength}
                        length={ctgFollowingLength}
                        categories={categories}
                        currentUser={user}
                        refreshUserData={refreshUserData}
                        onFollow={handleFollowCategory}
                        onUnfollow={handleUnfollowCategory}
                    />
                )}
            </div>
            <style>{`
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 24px;
                    font-weight: bold;
                }
            `}</style>
        </>
    );
};

const InfoBlock = ({ color, title, count }) => (
    <div className={`p-4 ${color} text-center skill-block`}>
        <h4>{count}</h4>
        <h6>{title}</h6>
    </div>
);

export default Profile;