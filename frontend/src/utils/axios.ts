import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://178.236.246.165:5000/api',
    withCredentials: true,
});

export default instance;
