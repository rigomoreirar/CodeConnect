import React, { useEffect, useState } from "react";

const CategoryPost = ({ category, catArray, setCatArray }) => {
    const [select, setSelect] = useState(false);

    const handleSelect = () => {
        if (catArray.some((cat) => cat === category)) {
            setCatArray(catArray.filter((cat) => cat !== category));
        } else {
            setCatArray([...catArray, category]);
        }
    };

    useEffect(() => {
        if (catArray.indexOf(category) !== -1) {
            setSelect(true);
        } else {
            setSelect(false);
        }
    }, [catArray, category]);

    return (
        <div onClick={handleSelect} className="ml-2 hover" key={category.name}>
            <span
                className={
                    select
                        ? "badge badge-primary mr-2 mb-1"
                        : "badge badge-secondary mr-2 mb-1"
                }
                style={{ padding: "7px" }}
            >
                {category.name}
            </span>
        </div>
    );
};

export default CategoryPost;
