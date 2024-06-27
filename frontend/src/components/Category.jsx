import React, { useEffect, useState } from "react";
import "../styles/Filters.css";

const Category = ({ category, activeFilter, setActiveFilter }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        if (activeFilter.includes(category)) {
            setActiveFilter([]);
        } else {
            setActiveFilter([category]);
        }
    };

    useEffect(() => {
        setSelected(activeFilter.includes(category));
    }, [activeFilter, category]);

    return (
        <div
            onClick={handleSelect}
            className={`category-item ml-2 hover ${selected ? "selected" : ""}`}
            key={category.id}
        >
            <div
                className={
                    selected
                        ? "category-item-btn"
                        : "category-item-btn-unselected"
                }
            >
                {category.name}
            </div>
        </div>
    );
};

export default Category;
