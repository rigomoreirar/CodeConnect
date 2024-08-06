import React, { useContext, useEffect, useState } from "react";
import CategoryPost from "../components/CategoryPost";

import styles from "../styles/CategoryBox.module.css";

import { AppContext } from "../context/AppContext";

const CategoryBox = ({ catArray, setCatArray }) => {
    const { categories } = useContext(AppContext);
    const [displayedCategories, setDisplayedCategories] = useState(categories);

    useEffect(() => {
        const previousCategories = displayedCategories.map((cat) => cat.id);
        const currentCategories = categories.map((cat) => cat.id);

        if (JSON.stringify(previousCategories) !== JSON.stringify(currentCategories)) {
            const newSelectedCategories = catArray.filter(cat =>
                currentCategories.includes(cat.id)
            );
            setCatArray(newSelectedCategories);

            setDisplayedCategories(categories);
        }
    }, [categories, catArray, setCatArray, displayedCategories]);

    return (
        <div className={styles["category-box"]} >
            {displayedCategories.map((category) => (
                <CategoryPost
                    catArray={catArray}
                    setCatArray={setCatArray}
                    key={category.id}
                    category={category}
                />
            ))}
        </div>
    );
};

export default CategoryBox;
