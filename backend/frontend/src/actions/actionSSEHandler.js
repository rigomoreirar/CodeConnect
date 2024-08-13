import axios from "../utils/axios";
import endpoints from "../utils/endpoints";

export const handleSSE = (setUser, setCategories, setPosts, setProposals) => {
    const eventSource = new EventSource(endpoints.sse.sseEndpoint);

    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.message === "refetch" && data.route === "get-all-data") {
            refetchAllData(setUser, setCategories, setPosts, setProposals);
        }
    };

    return () => {
        eventSource.close();
    };
};

const refetchAllData = async (
    setUser,
    setCategories,
    setPosts,
    setProposals
) => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await axios.get(endpoints.user.getAllData, {
                headers: { Authorization: `Token ${token}` },
            });
            const { user, categories, posts, proposals } = response.data;
            setUser(user);
            setCategories(categories);
            setPosts(posts);
            setProposals(proposals); // Ensure proposals are updated here as well
        } catch (err) {
            console.error("Failed to refetch data:", err);
        }
    }
};
