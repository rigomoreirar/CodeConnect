import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const submitCategoryProposal = async (
    token,
    proposalData,
    setProposals
) => {
    try {
        // Convert all proposalData values to strings
        const stringifiedProposalData = {};
        for (const key in proposalData) {
            if (proposalData.hasOwnProperty(key)) {
                stringifiedProposalData[key] = String(proposalData[key]);
            }
        }

        // Send the new proposal to the backend
        const response = await axios.post(
            endpoints.proposals.createProposal,
            stringifiedProposalData,
            {
                headers: {
                    Authorization: `Token ${String(token)}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Refetch all data after submitting the proposal
        const allData = await fetchAllData(String(token));
        setProposals(allData.proposals);

        return response; // Return the successful response
    } catch (error) {
        console.error("Failed to submit category proposal:", error);
        return error.response; // Return the error response
    }
};
