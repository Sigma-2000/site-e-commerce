import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useUsersStore = defineStore('users', {
    state: () => ({
        userInformation: null,
        error: null,
        success: null,
        loginOrigin: null,
    }),
    actions: {
        async login(credentials) {
            this.error = null;
            try {
                const response = await axiosCaller.post('/login', credentials);
                this.userInformation = response.data;
                return true;
            } catch (err) {
                this.error = 'errors.auth';
                console.error(err);
                return false;
            }
        },
        async signUp(data) {
            this.error = null;
            try {
                await axiosCaller.post('/sign-up', data);
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    this.error = 'errors.already-subscribe';
                } else {
                    this.error = 'errors.subscribe';
                }
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
        async fetchUser() {
            try {
                const response = await axiosCaller.get('/me');
                this.userInformation = response.data;
            } catch (err) {
                this.userInformation = null;
                console.error(err.response?.data || err);
            }
        },
        async deleteAccount() {
            this.error = null;
            try {
                await axiosCaller.delete('/me');
                this.userInformation = null;
                return true;
            } catch (err) {
                this.error = 'errors.delete-account';
                console.error(err);
                return false;
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
        /*
        async deleteAccountByAdmin() {
            try {
                await axiosCaller.delete(`/user/${this.userInformation.id}`);
            } catch (err) {
                this.error = 'errors.delete-account';
                console.error(err);
            }
        },*/
        async refreshAccessToken() {
            try {
                await axiosCaller.post('/refresh-token');

                return true;
            } catch (err) {
                this.userInformation = null;

                console.error(err);

                throw err;
            }
        },
        setLoginOrigin(origin) {
            this.loginOrigin = origin;
        },
        resetLoginOrigin() {
            this.loginOrigin = null;
        },
        async forgotPassword(email) {
            return axiosCaller.post('/forgot-password', {
                email,
            });
        },
        async resetPassword(token, password, passwordConfirmation) {
            return axiosCaller.post('/reset-password', {
                token,
                password,
                passwordConfirmation,
            });
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
