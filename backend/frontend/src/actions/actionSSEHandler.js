import axios from '../axios';
import endpoints from '../endpoints';

export const handleSSE = (setUser, setCategories, setPosts) => {
    const eventSource = new EventSource(endpoints.sse.sseEndpoint);
    
    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.message === 'refetch' && data.route === 'get-all-data') {
            refetchAllData(setUser, setCategories, setPosts);
        }
    };

    return () => {
        eventSource.close();
    };
};

const refetchAllData = async (setUser, setCategories, setPosts) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get(endpoints.user.getAllData, {
                headers: { Authorization: `Token ${token}` },
            });
            const { user, categories, posts } = response.data;
            setUser(user);
            setCategories(categories);
            setPosts(posts);
        } catch (err) {
            console.error('Failed to refetch data:', err);
        }
    }
};
