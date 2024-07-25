import React, { useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import Axios from "../utils/Axios";

const Following = ({
    category,
    ctg_following,
    currentUser,
    setLength,
    refreshUserData,
}) => {
    const [array, setArray] = useState(ctg_following);
    const [fill, setFill] = useState(array.includes(category.name));

    const handleCat = async (category) => {
        let newArray;
        if (array.includes(category.name)) {
            newArray = array.filter((cat) => cat !== category.name);
            setLength((prevLength) => prevLength - 1);
            try {
                await Axios.post("unfollow/", {
                    ...category,
                    user: currentUser,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            newArray = [...array, category.name];
            setLength((prevLength) => prevLength + 1);
            try {
                await Axios.post("follow/", {
                    ...category,
                    user: currentUser,
                });
            } catch (error) {
                console.log(error);
            }
        }
        setArray(newArray);
        refreshUserData();
    };

    useEffect(() => {
        setFill(array.includes(category.name));
    }, [array, category.name]);

    return (
        <div
            onClick={() => handleCat(category)}
            className="hover justify-content-center"
            key={category.name}
            style={{ padding: "1em", border: "solid" }}
        >
            {category.name}
            <AiFillCheckCircle
                className="ml-2"
                style={fill ? { fill: "green" } : { fill: "lightgrey" }}
            />
        </div>
    );
};

export default Following;