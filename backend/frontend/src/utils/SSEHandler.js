import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { handleSSE } from '../actions/actionSSEHandler';

const SSEHandler = () => {
    const { setUser, setCategories, setPosts } = useContext(AppContext);

    useEffect(() => {
        handleSSE(setUser, setCategories, setPosts);
    }, [setUser, setCategories, setPosts]);

    return null;
};

export default SSEHandler;
