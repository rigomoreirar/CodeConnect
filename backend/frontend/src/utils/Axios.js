import axios from 'axios';
// import Cookies from 'js-cookie';

const environment = "production";
const instance = axios.create({
    baseURL: environment === "development" ? "http://localhost:8000/api" : "/api"
});

export default instance;
