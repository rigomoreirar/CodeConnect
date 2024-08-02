import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

let isReloading = false;

export const handleSSE = async (setUser, setCategories, setPosts) => {
    const token = localStorage.getItem("token");
    if (!token) {
        handleInvalidToken();
        return;
    }

    try {
        await validateToken(token);
        const eventSource = new EventSource(`${endpoints.sse.sseEndpoint}?token=${token}`);

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.message === 'refetch' && data.route === 'get-all-data') {
                refetchAllData(setUser, setCategories, setPosts);
            }
        };

        eventSource.onerror = function() {
            console.error("SSE connection error. Reconnecting...");
            eventSource.close();
            checkTokenValidity(setUser, setCategories, setPosts);
            setTimeout(() => handleSSE(setUser, setCategories, setPosts), 3000);
        };

        return eventSource;
    } catch (err) {
        console.error('Token validation failed:', err);
        handleInvalidToken(err);
    }
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
            handleInvalidToken(err);
        }
    } else {
        handleInvalidToken();
    }
};

const checkTokenValidity = async (setUser, setCategories, setPosts) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await validateToken(token);
        } catch (err) {
            console.error('Token validity check failed:', err);
            handleInvalidToken(err);
        }
    } else {
        handleInvalidToken();
    }
};

const validateToken = async (token) => {
    const response = await axios.get(endpoints.user.getAllData, {
        headers: { Authorization: `Token ${token}` },
    });
    return response.data;
};

const handleInvalidToken = (err) => {
    if (!isReloading) {
        isReloading = true;
        if (err && err.response && err.response.status === 401 && err.response.data.detail === "Invalid token.") {
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("token");
        }
    }
};
