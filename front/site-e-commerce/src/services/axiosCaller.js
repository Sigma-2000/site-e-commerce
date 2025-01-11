import axios from 'axios';

const axiosCaller = axios.create({
    baseURL: 'http://localhost:3000/api', //need .env for front
    headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json', Set up an interceptors..
    },
    withCredentials: true,
});
axiosCaller.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});
export { axiosCaller };
