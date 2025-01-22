import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        filterType: 'all',
        error: null,
        success: null,
    }),
    actions: {
        async fetchAllOrders() {
            console.log('appel');
            this.error = null;
            try {
                const response = await axiosCaller.get('/orders');
                this.orders = response.data;
                console.log(response.data);
            } catch (err) {
                this.error = 'Erreur lors de la récupération des commandes.';
                console.error(err);
            }
        },
        async updateOrderStatus(orderId, status) {
            this.error = null;
            this.success = null;
            try {
                const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
                if (!validStatuses.includes(status)) {
                    this.error = 'Statut invalide.';
                    return;
                }
                const response = await axiosCaller.put(`/order/${orderId}`, {
                    status_order: status,
                });
                this.success = 'Statut de la commande mis à jour.';
                console.log('Order updated:', response.data);
                // Mettre à jour la commande dans le tableau local
                //fetch de nouveau ??
                const index = this.orders.findIndex((order) => order._id === orderId);
                if (index !== -1) {
                    this.orders[index] = response.data.order;
                }
            } catch (err) {
                this.error = `Erreur lors de la mise à jour du statut de la commande ${orderId}.`;
                console.error(err);
            }
        },
        setFilterType(type) {
            this.filterType = type;
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
