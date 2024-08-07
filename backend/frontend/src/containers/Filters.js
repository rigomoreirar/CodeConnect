import React from "react";

import styles from "../styles/FiltersCategory.module.css";

import Category from "../components/Category";

const Filters = ({
    categories,
    activeFilter,
    setActiveFilter,
    neededCategories,
}) => {
    const categoryArray = Array.isArray(categories) ? categories : [];

    return (
        <>
            <div className={styles.filterContainer}></div>
            {neededCategories && (
                <div className={styles["categories-container"]}>
                    {categoryArray.map((category) => (
                        <Category
                            key={category.id}
                            category={category}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default Filters;