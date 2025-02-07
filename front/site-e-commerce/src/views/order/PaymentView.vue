<template>
    <div class="payment-view">
        <div class="underline-short"></div>
        <!--<router-link to="/shop" class="pages-link">-->
        <h2>{{ $t('menu.shop') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('cart.payment') }}</h3>
        <ErrorComponent v-if="error" :error="error" />
        <form v-if="localClientSecret" @submit.prevent="handlePayment" class="payment-overview">
            <p class="cart-amount">
                {{ $t('cart.amount') }} <strong>{{ cartTotalPrice }} €</strong>
            </p>
            <div id="card-element"></div>
            <ButtonComponent type="submit" :disabled="loading" class="button-pay">{{
                $t('button.payment')
            }}</ButtonComponent>
        </form>

        <LoaderComponent v-else></LoaderComponent>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import { useOrdersStore } from '@/stores/ordersStore';
import { useCartStore } from '@/stores/cartStore';
import { confirmPayment } from '@/services/orderPaymentServices';

import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';

const router = useRouter();
const ordersStore = useOrdersStore();
const cartStore = useCartStore();

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const localClientSecret = ref(null);
const loading = ref(false);

const cartTotalPrice = computed(() => cartStore.totalPrice);
const error = computed(() => ordersStore.error);
const orderId = computed(() => ordersStore.currentOrderId);

//Finer control and better reactivity management
watchEffect(() => {
    localClientSecret.value = ordersStore.currentclientSecret;
});

onMounted(async () => {
    ordersStore.resetErrorSuccess();
    try {
        stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        elements.value = stripe.value.elements();
        //wait for Dom updated
        await nextTick();

        cardElement.value = elements.value.create('card');
        cardElement.value.mount('#card-element');
    } catch (err) {
        console.error(err);
    }
});

const handlePayment = async () => {
    try {
        loading.value = true;
        const result = await stripe.value.confirmCardPayment(localClientSecret.value, {
            payment_method: {
                card: cardElement.value,
            },
        });

        if (result.error) {
            ordersStore.error = 'errors.payment-failed';
            await ordersStore.cancelOrder(orderId.value);
            cartStore.resetCart();
            setTimeout(() => {
                router.push('/account');
            }, 4000);
            return;
        }

        const order = await confirmPayment(result.paymentIntent.id);

        if (order) {
            cartStore.resetCart();
            ordersStore.setOrderOrigin('order');
            router.push('/thank-you');
        }
    } catch (err) {
        console.error(err);
        ordersStore.setError('errors.payment-failed');
        await ordersStore.cancelOrder(orderId.value);
    } finally {
        loading.value = false;
    }
};
</script>
