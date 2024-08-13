import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const fetchAllData = async (token) => {
    const allDataResponse = await axios.get(endpoints.user.getAllData, {
        headers: { Authorization: `Token ${token}` },
    });

    const { user, categories, posts, proposals } = allDataResponse.data;

    // console.log(`appContext: ${JSON.stringify(proposals)}`); // Pretty-print the JSON data
    return {
        user,
        categories,
        posts,
        proposals,
    };
};
