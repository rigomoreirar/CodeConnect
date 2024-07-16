import { useState, useEffect } from "react";
import axios from "axios";
import CategoryFollow from "../containers/CategoryFollow";
import "../styles/Profile.css";
import ProfilePicture from "../components/ProfilePicture";
import Filters from "../containers/Filters";

const Profile = ({ currentUser, categories, setLoggedUser }) => {
    const [modal, setModal] = useState(false);
    const [ctgFollowingLength, setCtgFollowingLength] = useState(
        currentUser.profile_data.ctg_following.length
    );
    const [loading, setLoading] = useState(true);

    const {
        email,
        first_name,
        last_name,
        likes,
        dislikes,
        comments,
        profile_data: { ctg_following },
        username,
    } = currentUser;

    const fetchUserData = async () => {
        try {
            const token = window.localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get("http://localhost:8000/user/", {
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

    useEffect(() => {
        setCtgFollowingLength(ctg_following.length);
    }, [ctg_following]);

    useEffect(() => {
        fetchUserData();
    }, [setLoggedUser]);

    useEffect(() => {
        if (!modal) {
            fetchUserData();
        }
    }, [modal]);

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
                            <div className="col-md-4 col-lg-4">
                                <ProfilePicture userId={currentUser.id} />
                            </div>
                            <div className="col-md-8 col-lg-8">
                                <div className="d-flex flex-column">
                                    <div className="d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
                                        <h3 className="display-5">
                                            {first_name} {last_name}
                                        </h3>
                                        <h5>@{username}</h5>
                                    </div>
                                    <div className="p-3 bg-black text-white">
                                        <h6>{email}</h6>
                                    </div>
                                    <div className="d-flex flex-row text-white">
                                        <InfoBlock
                                            color="bg-success"
                                            title="Likes"
                                            count={likes.length}
                                        />
                                        <InfoBlock
                                            color="bg-secondary"
                                            title="Comments"
                                            count={comments.length}
                                        />
                                        <InfoBlock
                                            color="bg-danger"
                                            title="Dislikes"
                                            count={dislikes.length}
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
