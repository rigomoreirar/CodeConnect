import React, { useState, useEffect, useContext } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AppContext } from "../context/AppContext";

const Following = ({
    category,
    ctg_following,
    currentUser,
    setLength,
    refreshUserData,
}) => {
    const { user } = useContext(AppContext);
    const [array, setArray] = useState(ctg_following);
    const [fill, setFill] = useState(
        array.some((cat) => cat.name === category.name)
    );

    const handleCat = async (category) => {
        let newArray;
        if (array.some((cat) => cat.name === category.name)) {
            newArray = array.filter((cat) => cat.name !== category.name);
            setLength((prevLength) => prevLength - 1);
            console.log("Unfollowed category:", category.name);
        } else {
            newArray = [...array, category];
            setLength((prevLength) => prevLength + 1);
            console.log("Followed category:", category.name);
        }
        setArray(newArray);
        refreshUserData();
    };

    useEffect(() => {
        setFill(array.some((cat) => cat.name === category.name));
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
