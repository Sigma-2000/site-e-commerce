import axios from 'axios';
import { useUsersStore } from '@/stores/usersStore.js';

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
/*
axiosCaller.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const usersStore = useUsersStore();
                const newToken = await usersStore.refreshAccessToken();
                originalRequest.headers.Authorization = `JWT ${newToken}`;
                return axiosCaller(originalRequest);
            } catch (refreshError) {
                console.error('Operation failed');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
*/
export { axiosCaller };
