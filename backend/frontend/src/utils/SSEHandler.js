import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { handleSSE } from "../actions/actionSSEHandler";

const SSEHandler = () => {
    const { setUser, setCategories, setPosts, setProposals } =
        useContext(AppContext);

    useEffect(() => {
        handleSSE(setUser, setCategories, setPosts, setProposals);
    }, [setUser, setCategories, setPosts, setProposals]);

    return null;
};

export default SSEHandler;
