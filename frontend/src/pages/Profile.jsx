import { useState, useEffect } from "react";
import CategoryFollow from "../containers/CategoryFollow";
import "../styles/Profile.css";
import ProfilePic from "../assets/no-profile-picture.webp";

const Profile = ({ currentUser, categories }) => {
    const [modal, setModal] = useState(false);
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

    useEffect(() => {
        console.log(ctg_following);
    }, [ctg_following]);

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="container mb-5 ">
                <div className="row no-gutters">
                    <div className="col-md-4 col-lg-4">
                        <img src={ProfilePic} alt="profile" />
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
                                    className="hover p-4 bg-dark text-center skill-block"
                                >
                                    <h4>{ctg_following.length}</h4>
                                    <h6>Categories</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal && (
                <CategoryFollow
                    setLength={() => {}}
                    length={ctg_following.length}
                    categories={categories}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

const InfoBlock = ({ color, title, count }) => (
    <div className={`p-4 ${color} text-center skill-block`}>
        <h4>{count}</h4>
        <h6>{title}</h6>
    </div>
);

export default Profile;
