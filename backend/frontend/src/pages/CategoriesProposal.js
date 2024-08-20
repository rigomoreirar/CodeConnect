import styles from "../styles/CategoriesProposal.module.css";

import Filters from "../containers/Filters";
import CategoryProposalForm from "../components/CategoryProposalForm";
import CategoryProposalTable from "../components/CategoryProposalTable";

const CategoryProposalContainer = () => {
    return (
        <>
            <Filters neededCategories={false} />
            <div className={styles.mainContainer}>
                <div className={`${styles.headerTitle} ml-3 mt-3 display-4`}>
                    <p>Suggest a New Category!</p>
                </div>
                <div className={styles.tableContainer}>
                    <CategoryProposalTable />
                </div>
                <div className={styles.formContainer}>
                    <CategoryProposalForm />
                </div>
            </div>
        </>
    );
};

export default CategoryProposalContainer;
