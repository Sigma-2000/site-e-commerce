import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useUsersStore = defineStore('users', {
    state: () => ({
        userInformation: null,
        error: null,
        success: null,
    }),
    actions: {
        async login(credentials) {
            this.error = null;
            try {
                const response = await axiosCaller.post('/login', credentials);
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
        async updateAddress(address) {
            this.error = null;
            this.success = null;
            try {
                const response = await axiosCaller.put('/user/address', address);
                this.userInformation.address_id = response.data;
                this.success = 'success.update-address';
            } catch (error) {
                this.error = 'errors.update-address';
                console.error(error);
            }
        },
        resetError() {
            this.error = null;
            this.success = null;
        },
        async fetchUser() {
            if (!this.userInformation?.id) {
                this.userInformation = null;
                return;
            }
            try {
                const response = await axiosCaller.get(`/user/${this.userInformation.id}`);
                this.userInformation = response.data;
            } catch (err) {
                this.userInformation = null;
                console.error(err);
            }
        },
        //TODO implement a back end road for disconnect/logout !!
    },
});
