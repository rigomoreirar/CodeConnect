// utils/axios.js

import axios from 'axios';
import endpoints from './endpoints';

const axiosInstance = axios.create({
    baseURL: endpoints.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Exclude endpoints that do not require a token
        const noAuthEndpoints = [
            endpoints.auth.login,
            endpoints.auth.register,
            endpoints.emails.resetUserPasswordEmail,
        ];

        if (token && !noAuthEndpoints.includes(config.url)) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
