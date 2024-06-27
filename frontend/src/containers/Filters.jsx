import React from "react";
import "../styles/Filters.css";
import Category from "../components/Category";
const Filters = ({
    categories,
    activeFilter,
    setActiveFilter,
    neededCategories,
}) => {
    return (
        <>
            <div className="filterContainer"></div>
            {neededCategories && (
                <div className="categories-container">
                    {categories.map((category) => {
                        return (
                            <Category
                                key={category.id}
                                category={category}
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default Filters;
