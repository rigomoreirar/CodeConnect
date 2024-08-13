import CategoryProposalForm from "../components/CategoryProposalForm";
import CategoryProposalTable from "../components/CategoryProposalTable";
import styles from "../styles/CategoriesProposal.module.css";

const CategoryProposalContainer = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.headerTitle} ml-3 mt-3 display-4`}>
                <p>Propose a new Category!</p>
            </div>
            <div className={styles.tableContainer}>
                <CategoryProposalTable />
            </div>
            <div className={styles.formContainer}>
                <CategoryProposalForm />
            </div>
        </div>
    );
};

export default CategoryProposalContainer;
