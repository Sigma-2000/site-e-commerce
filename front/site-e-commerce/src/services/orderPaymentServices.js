import { axiosCaller } from './axiosCaller';
import { useOrdersStore } from '@/stores/ordersStore';

const orderStore = useOrdersStore();

export const createOrder = async (orderData) => {
    try {
        const response = await axiosCaller.post('/order', orderData);
        return response.data.order;
    } catch (err) {
        console.error(err);
        orderStore.setError('errors.order-creation');
    }
};

export const createCheckoutSession = async (paymentData) => {
    try {
        const response = await axiosCaller.post('/create-checkout-session', paymentData);
        return response;
    } catch (err) {
        console.error(err);
        orderStore.setError('errors.create-payment');
    }
};

export const confirmPayment = async (paymentIntentId) => {
    try {
        const response = await axiosCaller.post('/confirm-payment', {
            payment_intent_id: paymentIntentId,
        });
        return response.data.order;
    } catch (err) {
        console.error('Error confirming payment:', err);
        orderStore.setError('errors.payment-failed');
    }
};
