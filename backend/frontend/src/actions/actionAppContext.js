import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const fetchAllData = async (token) => {
    const allDataResponse = await axios.get(endpoints.user.getAllData, {
        headers: { Authorization: `Token ${String(token)}` },
    });

    const { user, categories, posts, proposals } = allDataResponse.data;

    return {
        user,
        categories,
        posts,
        proposals,
    };
};
