// actions/actionAppContext.js

import axios from '../utils/axios';
import endpoints from '../utils/endpoints';

export const fetchAllData = async (token) => {
    const allDataResponse = await axios.get(endpoints.user.getAllData, {
        headers: { Authorization: `Token ${token}` },
    });

    const { user, categories, posts } = allDataResponse.data;
    console.log('posts', posts);
    console.log('user', user);
    console.log('categories', categories);
    return {
        user,
        categories,
        posts,
    };
};
