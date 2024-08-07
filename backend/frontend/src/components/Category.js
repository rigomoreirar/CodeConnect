import React, { useEffect, useState } from "react";

import styles from "../styles/FiltersCategory.module.css";

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
            className={`${styles["category-item"]} ${styles["ml-2"]} ${styles["hover"]} ${selected ? styles["selected"] : ""}`}
            key={category.id}
        >
            <div
                className={
                    selected
                        ? styles["category-item-btn"]
                        : styles["category-item-btn-unselected"]
                }
            >
                {category.name}
            </div>
        </div>
    );
};

export default Category;