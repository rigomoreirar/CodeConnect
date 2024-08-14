import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const deleteProposal = async (
    token,
    proposalId,
    userId,
    creatorUsername,
    setProposals
) => {
    try {
        await axios.post(
            endpoints.proposals.deleteProposal(String(proposalId)),
            {
                user_id: String(userId),
                creator_id: String(creatorUsername),
            },
            {
                headers: {
                    Authorization: `Token ${String(token)}`,
                },
            }
        );
        setProposals((prevProposals) =>
            prevProposals.filter((proposal) => proposal.id !== proposalId)
        );
    } catch (error) {
        console.error("Failed to delete proposal:", error);
    }
};

export const voteProposal = async (
    token,
    username,
    proposalName,
    setProposals
) => {
    try {
        const response = await axios.post(
            endpoints.proposals.voteProposal,
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

        setProposals((prevProposals) =>
            prevProposals.map((proposal) =>
                proposal.name === proposalName
                    ? { ...proposal, votes: response.data.votes }
                    : proposal
            )
        );
    } catch (error) {
        console.error("Failed to vote on proposal:", error);
    }
};

export const unvoteProposal = async (
    token,
    username,
    proposalName,
    setProposals
) => {
    try {
        const response = await axios.post(
            endpoints.proposals.unvoteProposal,
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

        setProposals((prevProposals) =>
            prevProposals.map((proposal) =>
                proposal.name === proposalName
                    ? { ...proposal, votes: response.data.votes }
                    : proposal
            )
        );
    } catch (error) {
        console.error("Failed to unvote on proposal:", error);
    }
};
