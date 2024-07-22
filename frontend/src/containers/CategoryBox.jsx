import React from "react";
import CategoryPost from "../components/CategoryPost";
import "../styles/CategoryBox.css";

const CategoryBox = ({ categories, catArray, setCatArray }) => {
    const categoryArray = Array.isArray(categories) ? categories : [];
    return (
        <div className="category-box" style={{ margin: "10px" }}>
            {categoryArray.map((category) => {
                return (
                    <CategoryPost
                        catArray={catArray}
                        setCatArray={setCatArray}
                        key={category.name}
                        category={category}
                    />
                );
            })}
        </div>
    );
};

export default CategoryBox;
