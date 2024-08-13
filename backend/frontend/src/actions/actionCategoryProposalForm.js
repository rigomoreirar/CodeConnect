import axios from "../utils/axios";
import endpoints from "../utils/endpoints";
import { fetchAllData } from "./actionAppContext";

export const submitCategoryProposal = async (
    token,
    proposalData,
    setProposals
) => {
    try {
        // Send the new proposal to the backend
        const response = await axios.post(
            endpoints.proposals.createProposal,
            proposalData,
            {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Refetch all data after submitting the proposal
        const allData = await fetchAllData(token);
        setProposals(allData.proposals);

        return response; // Return the successful response
    } catch (error) {
        console.error("Failed to submit category proposal:", error);
        return error.response; // Return the error response
    }
};
