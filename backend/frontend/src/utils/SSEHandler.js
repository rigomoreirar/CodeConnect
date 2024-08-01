import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from './axios';
import endpoints from './endpoints';

const SSEHandler = () => {
    const { setUser, setCategories, setPosts } = useContext(AppContext);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8000/api/sse/');
        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.message === 'refetch' && data.route === 'get-all-data') {
                refetchAllData();
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const refetchAllData = async () => {
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

    return null;
};

export default SSEHandler;