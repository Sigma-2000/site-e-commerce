import axios from 'axios';

const axiosCaller = axios.create({
    baseURL: import.meta.env.VITE_BACK_API_BASE_URL,
    headers: {
        Accept: 'application/json',
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
