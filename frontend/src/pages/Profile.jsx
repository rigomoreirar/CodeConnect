import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CategoryFollow from "../containers/CategoryFollow";
import "../styles/Profile.css";
import ProfilePicture from "../components/ProfilePicture";
import Filters from "../containers/Filters";

const Profile = ({
    currentUser,
    categories,
    setLoggedUser,
    profilePictureUrl,
    setProfilePictureUrl,
}) => {
    const [modal, setModal] = useState(false);
    const [ctgFollowingLength, setCtgFollowingLength] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalDislikes, setTotalDislikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const fetchUserData = async () => {
        try {
            const token = window.localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get("/backend/user/", {
                headers: {
                    Authorization: token,
                },
            });

            const user = response.data.user_info;
            setLoggedUser(user);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };

    const fetchTotalLikes = async () => {
        try {
            const response = await axios.get(
                `/backend/total-likes-by-user/?user_id=${currentUser.id}`
            );
            setTotalLikes(response.data.total_likes);
        } catch (error) {
            console.error("Error fetching total likes:", error);
        }
    };

    const fetchTotalDislikes = async () => {
        try {
            const response = await axios.get(
                `/backend/total-dislikes-by-user/?user_id=${currentUser.id}`
            );
            setTotalDislikes(response.data.total_dislikes);
        } catch (error) {
            console.error("Error fetching total dislikes:", error);
        }
    };

    const fetchTotalComments = async () => {
        try {
            const response = await axios.get(
                `/backend/total-comments-by-user/?user_id=${currentUser.id}`
            );
            setTotalComments(response.data.total_comments);
        } catch (error) {
            console.error("Error fetching total comments:", error);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.profile_data) {
            setCtgFollowingLength(
                currentUser.profile_data.ctg_following.length
            );
            fetchTotalLikes();
            fetchTotalDislikes();
            fetchTotalComments();
        }
    }, [currentUser]);

    useEffect(() => {
        fetchUserData();
    }, [setLoggedUser]);

    useEffect(() => {
        if (!modal) {
            fetchUserData();
        }
    }, [modal]);

    useEffect(() => {
        const eventSourceLikes = new EventSource(
            `/backend/sse-total-likes/${currentUser.id}/`
        );
        eventSourceLikes.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTotalLikes(data.total_likes);
        };

        const eventSourceDislikes = new EventSource(
            `/backend/sse-total-dislikes/${currentUser.id}/`
        );
        eventSourceDislikes.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTotalDislikes(data.total_dislikes);
        };

        const eventSourceComments = new EventSource(
            `/backend/sse-total-comments/${currentUser.id}/`
        );
        eventSourceComments.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTotalComments(data.total_comments);
        };

        return () => {
            eventSourceLikes.close();
            eventSourceDislikes.close();
            eventSourceComments.close();
        };
    }, [currentUser.id]);

    // Default values to avoid destructuring errors
    const email = currentUser?.email || "";
    const first_name = currentUser?.first_name || "";
    const last_name = currentUser?.last_name || "";
    const ctg_following = currentUser?.profile_data?.ctg_following || [];
    const username = currentUser?.username || "";

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
                                    userId={currentUser.id}
                                    imageUrl={profilePictureUrl}
                                    setImageUrl={setProfilePictureUrl}
                                    refreshProfile={fetchUserData}
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
                                                    to={{
                                                        pathname:
                                                            "/forum/edit-profile",
                                                    }}
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
                        currentUser={currentUser}
                        refreshUserData={fetchUserData}
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
