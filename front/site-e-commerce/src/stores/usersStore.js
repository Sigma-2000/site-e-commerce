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
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        }, //TODO: change name
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
        async logout() {
            try {
                await axiosCaller.post('/logout');
                this.userInformation = null;
            } catch (err) {
                console.error(err);
            }
        },
        async deleteAccount() {
            this.error = null;
            if (!this.userInformation?.id) {
                this.userInformation = null;
                return;
            }
            try {
                await axiosCaller.delete(`/user/${this.userInformation.id}`);
                this.userInformation = null;
            } catch (err) {
                this.error = 'errors.delete-account';
                console.error(err);
            }
        },
        async refreshAccessToken() {
            try {
                if (!this.userInformation) {
                    return;
                }
                const response = await axiosCaller.post('/refresh-token');

                return response.data.token;
            } catch (err) {
                console.error(err);
            }
        },
    },
});
