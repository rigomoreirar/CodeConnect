import { useContext, useState, useEffect } from "react";

import { AppContext } from "../context/AppContext";
import {
    createCategory,
    deleteCategory,
    fetchCategoriesByUser,
} from "../actions/actionCreateCategories";

import styles from "../styles/CreateCategory.module.css";

import Loader from "../components/Loader";
import Filters from "../containers/Filters";
import CategoryProposalsTable from "../components/CategoryProposalTable";

const CreateCategory = () => {
    const { user, categories, setCategories } = useContext(AppContext);
    const [userCategories, setUserCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const fetchedCategories = await fetchCategoriesByUser(
                    user.id,
                    token
                );
                setCategories(fetchedCategories);
                setUserCategories(
                    Array.isArray(fetchedCategories) ? fetchedCategories : []
                );
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
                id: createdCategory.id,
                name: categoryName,
            };
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            setUserCategories((prevUserCategories) => [
                ...prevUserCategories,
                newCategory,
            ]);
            console.log("Category created:", newCategory);
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const handleCategoryDelete = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            const updatedCategories = categories.filter(
                (category) => category.id !== categoryId
            );
            const updatedUserCategories = userCategories.filter(
                (category) => category.id !== categoryId
            );

            setCategories(updatedCategories);
            setUserCategories(updatedUserCategories);
            console.log(`Category deleted: ${categoryId}`);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <>
            <Filters
                activeFilter={true}
                setActiveFilter={true}
                neededCategories={false}
            />
            <div className={styles.homeContainer}>
                <div
                    className={`${styles.innerMain} d-flex flex-column align-items-center`}
                >
                    <h1
                        className={`display-4 ${styles.alignTextCenter} ${styles.firstTitle}`}
                    >
                        Add New Categories!
                    </h1>
                    <h2 className={`mb-3 display-5 ${styles.alignTextCenter}`}>
                        Proposals from users
                    </h2>

                    <div className={styles.tableContainer}>
                        <CategoryProposalsTable />
                    </div>
                    <div className={styles.tableContainer}>
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
                                                        handleCategoryDelete(
                                                            category.id
                                                        )
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
            </div>
        </>
    );
};

export default CreateCategory;
