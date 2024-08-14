import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const deleteProposal = async (token, proposalId, setProposals) => {
    try {
        // Send the delete request to the backend
        await axios.delete(endpoints.proposals.deleteProposal(proposalId), {
            headers: {
                Authorization: `Token ${token}`,
            },
        });

        // Refetch all data after deleting the proposal
        const allData = await fetchAllData(token);
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
                username,
                proposal_name: proposalName,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Refetch all data after voting/unvoting
        const allData = await fetchAllData(token);
        setProposals(allData.proposals);
    } catch (error) {
        console.error("Failed to vote on proposal:", error);
    }
};
