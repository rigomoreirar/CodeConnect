import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaTrashAlt } from "react-icons/fa";

import {
    deleteProposal,
    toggleVote,
} from "../actions/actionCategoryProposalTable";

import styles from "../styles/CategoryProposalTable.module.css";

const CategoryProposalTable = () => {
    const { user, proposals, setProposals } = useContext(AppContext);

    const handleDelete = async (proposalId) => {
        await deleteProposal(user.token, proposalId, setProposals);
    };

    const handleVote = async (proposalName) => {
        await toggleVote(user.token, user.username, proposalName, setProposals);
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
                                        <button
                                            onClick={() =>
                                                handleVote(proposal.name)
                                            }
                                            className={`${styles.voteButton} ${
                                                proposal.votes.includes(
                                                    user.username
                                                )
                                                    ? styles.unvote
                                                    : ""
                                            }`}
                                        >
                                            {proposal.votes.includes(
                                                user.username
                                            )
                                                ? "Unvote"
                                                : "Vote"}
                                        </button>
                                    )}
                                </td>
                                <td>{proposal.votes.length}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No proposals available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryProposalTable;
