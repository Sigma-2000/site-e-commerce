import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        filterType: 'all',
        error: null,
        success: null,
        orderOrigin: null,
    }),
    actions: {
        async createOrder(orderData) {
            this.error = null;
            this.success = null;
            try {
                const response = await axiosCaller.post('/order', orderData);
                return response.data;
            } catch (err) {
                this.error = 'errors.order-creation';
                console.error(err);
            }
        },
        async fetchAllOrders() {
            console.log('appel');
            this.error = null;
            try {
                const response = await axiosCaller.get('/orders');
                this.orders = response.data;
                console.log(response.data);
            } catch (err) {
                this.error = 'errors.display-list';
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
                this.success = 'success.update-status';
                //fetch de nouveau ??
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
        resetOrderOrigin() {
            this.orderOrigin = null;
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
