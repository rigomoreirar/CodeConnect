import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaTrashAlt } from "react-icons/fa";

import {
    deleteProposal,
    voteProposal,
    unvoteProposal,
} from "../actions/actionCategoryProposalTable";

import styles from "../styles/CategoryProposalTable.module.css";

const CategoryProposalTable = () => {
    const { user, proposals, setProposals } = useContext(AppContext);

    const handleDelete = async (proposalId) => {
        const proposal = proposals.find((p) => p.id === proposalId);
        await deleteProposal(
            user.token,
            proposalId,
            user.id,
            proposal.created_by,
            setProposals
        );
    };

    const handleVote = async (proposalName) => {
        await voteProposal(
            user.token,
            user.username,
            proposalName,
            setProposals
        );
    };

    const handleUnvote = async (proposalName) => {
        await unvoteProposal(
            user.token,
            user.username,
            proposalName,
            setProposals
        );
    };

    const isModerator = user.username === "moderator";

    return (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Actions</th>
                        <th>Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {proposals && proposals.length > 0 ? (
                        proposals.map((proposal) => (
                            <tr key={proposal.id}>
                                <td>{proposal.name}</td>
                                <td>
                                    {isModerator ||
                                    proposal.created_by === user.username ? (
                                        <FaTrashAlt
                                            className={styles.deleteIcon}
                                            onClick={() =>
                                                handleDelete(proposal.id)
                                            }
                                        />
                                    ) : (
                                        <>
                                            {!proposal.votes.includes(
                                                user.username
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        handleVote(
                                                            proposal.name
                                                        )
                                                    }
                                                    className={
                                                        styles.voteButton
                                                    }
                                                >
                                                    Vote
                                                </button>
                                            )}
                                            {proposal.votes.includes(
                                                user.username
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        handleUnvote(
                                                            proposal.name
                                                        )
                                                    }
                                                    className={`${styles.voteButton} ${styles.unvote}`}
                                                >
                                                    Unvote
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td>{proposal.votes.length}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No categories suggested</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryProposalTable;
