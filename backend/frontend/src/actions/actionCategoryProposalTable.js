import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const deleteProposal = async (token, proposalId, setProposals) => {
    try {
        // Send the delete request to the backend
        await axios.delete(
            endpoints.proposals.deleteProposal(String(proposalId)),
            {
                headers: {
                    Authorization: `Token ${String(token)}`,
                },
            }
        );

        // Refetch all data after deleting the proposal
        const allData = await fetchAllData(String(token));
        setProposals(allData.proposals);
    } catch (error) {
        console.error("Failed to delete proposal:", error);
    }
};

export const toggleVote = async (
    token,
    username,
    proposalName,
    setProposals
) => {
    try {
        // Send the vote/unvote request to the backend
        await axios.post(
            endpoints.proposals.likeProposal,
            {
                username: String(username),
                proposal_name: String(proposalName),
            },
            {
                headers: {
                    Authorization: `Token ${String(token)}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Refetch all data after voting/unvoting
        const allData = await fetchAllData(String(token));
        setProposals(allData.proposals);
    } catch (error) {
        console.error("Failed to vote on proposal:", error);
    }
};
