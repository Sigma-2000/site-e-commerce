import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useUsersStore = defineStore('users', {
    state: () => ({
        userInformation: null,
        error: null,
    }),
    actions: {
        async login(credentials) {
            this.error = null;
            try {
                const response = await axiosCaller.post('/login', credentials, {
                    withCredentials: true,
                });
                console.log(response.data);
                this.userInformation = response.data;
            } catch (err) {
                this.error = 'errors.auth';
                console.error(err);
            }
        },
        async signUp(data) {
            this.error = null;
            try {
                await axiosCaller.post('/sign-up', data);
            } catch (err) {
                this.error = 'errors.subscribe';
                console.error(err);
            }
        },
        resetError() {
            this.error = null;
        },

        //TODO implement a back end road for disconnect/logout !!
    },
});
