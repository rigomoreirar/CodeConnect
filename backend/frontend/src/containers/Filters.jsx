import React from "react";
import "../styles/Filters.css";
import Category from "../components/Category";

const Filters = ({
    categories,
    activeFilter,
    setActiveFilter,
    neededCategories,
}) => {
    // Ensure categories is always an array
    const categoryArray = Array.isArray(categories) ? categories : [];

    return (
        <>
            <div className="filterContainer"></div>
            {neededCategories && (
                <div className="categories-container">
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
