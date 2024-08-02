import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { handleSSE } from '../actions/actionSSEHandler';

const SSEHandler = () => {
    const { setUser, setCategories, setPosts } = useContext(AppContext);

    useEffect(() => {
        const eventSource = handleSSE(setUser, setCategories, setPosts);
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [setUser, setCategories, setPosts]);

    return null;
};

export default SSEHandler;
