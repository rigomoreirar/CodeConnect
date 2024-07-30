import { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/Create.css";
import "../styles/Comments-legacy.css";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext";
import { createCategory, deleteCategory, fetchCategoriesByUser } from "../actions/actionCreateCategories";

const CreateCategory = () => {
    const { user, categories, setCategories } = useContext(AppContext);
    const [userCategories, setUserCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const fetchedCategories = await fetchCategoriesByUser(user.id, token);
                setCategories(fetchedCategories);
                setUserCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [setCategories, user.id]);

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryName = formData.get("category");

        try {
            const createdCategory = await createCategory(user.id, categoryName);
            const newCategory = {
                id: createdCategory.id,  // Ensure the id is correctly passed
                name: categoryName,
            };
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            setUserCategories((prevUserCategories) => [...prevUserCategories, newCategory]);
            console.log("Category created:", newCategory);
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const handleCategoryDelete = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            const updatedCategories = categories.filter((category) => category.id !== categoryId);
            const updatedUserCategories = userCategories.filter((category) => category.id !== categoryId);

            setCategories(updatedCategories);
            setUserCategories(updatedUserCategories);
            console.log(`Category deleted: ${categoryId}`);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <>
        <div className="filterContainer"></div>
            <div className="home-container">
                <div className="inner-main d-flex flex-column align-items-center">
                    <h1 className="mb-3 display-4">My Categories</h1>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleCategoryDelete(category.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <form onSubmit={handleCategorySubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                placeholder="New Category"
                                required
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCategory;
