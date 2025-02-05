import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        currentOrderId: null,
        currentclientSecret: null,
        orderOrigin: null,
        filterType: 'all',
        error: null,
        success: null,
    }),
    actions: {
        async fetchAllOrders() {
            this.error = null;
            try {
                const response = await axiosCaller.get('/orders');
                this.orders = response.data;
            } catch (err) {
                this.error = 'errors.display-list';
                console.error(err);
            }
        },
        async cancelOrder(orderId) {
            try {
                await axiosCaller.post('/cancel-order', { order_id: orderId });
                this.error = 'errors.payment-failed';
            } catch (err) {
                console.error(err);
            }
        },
        async updateOrderStatus(orderId, status) {
            this.error = null;
            this.success = null;
            try {
                const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
                if (!validStatuses.includes(status)) {
                    this.error = 'errors.invalid-status';
                    return;
                }
                await axiosCaller.put(`/order/${orderId}`, {
                    status_order: status,
                });
            } catch (err) {
                this.error = 'errors.update-status';
                console.error(err);
            }
        },
        setFilterType(type) {
            this.filterType = type;
        },
        setOrderOrigin(origin) {
            this.orderOrigin = origin;
        },
        setCurrentOrderId(orderId) {
            this.currentOrderId = orderId;
        },
        setCurrentSecretClient(clientSecret) {
            this.currentclientSecret = clientSecret;
        },
        setError(error) {
            this.error = error;
        },
        resetOrderOrigin() {
            this.orderOrigin = null;
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
