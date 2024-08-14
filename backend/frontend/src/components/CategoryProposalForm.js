import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import styles from "../styles/CategoryProposalForm.module.css";

import { submitCategoryProposal } from "../actions/actionCategoryProposalForm";

const CategoryProposalForm = () => {
    const { user, proposals, setProposals } = useContext(AppContext);
    const [proposalName, setProposalName] = useState("");
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    useEffect(() => {
        // Disable form if the user has already submitted a proposal or if there are 10 proposals
        const userHasProposal = proposals.some(
            (proposal) => proposal.created_by === user.username
        );
        const maxProposalsReached = proposals.length >= 10;

        setIsFormDisabled(userHasProposal || maxProposalsReached);
    }, [proposals, user.username]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!proposalName || isFormDisabled) {
            return;
        }

        const proposalData = {
            name: proposalName,
            created_by: user.username,
        };

        const response = await submitCategoryProposal(
            user.token,
            proposalData,
            setProposals
        );

        if (
            response.status === 400 &&
            response.data.message === "Proposal with this name already exists"
        ) {
            alert("Unable to submit two proposals with the same name");
        }

        setProposalName("");
    };

    return (
        <div className={styles.formContainer}>
            {isFormDisabled && (
                <p className={styles.disabledMessage}>
                    {proposals.length >= 10
                        ? "Maximum of 10 proposals reached."
                        : "You have already submitted a proposal."}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={proposalName}
                    onChange={(e) => setProposalName(e.target.value)}
                    placeholder="Enter category name"
                    className={styles.inputField}
                    disabled={isFormDisabled}
                />
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isFormDisabled}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CategoryProposalForm;
