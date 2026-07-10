<template>
    <div class="payment-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.shop') }}</h2>
        <div class="underline-long"></div>

        <template v-if="isSuccess">
            <h3>{{ $t('success.payment') }}</h3>
            <p>{{ $t('success.payment-approved') }}</p>
        </template>

        <template v-else-if="isCancel">
            <h3>{{ $t('errors.payment') }}</h3>
            <p>{{ $t('errors.payment-failed') }}</p>
        </template>

        <template v-else>
            <h3>{{ $t('cart.payment-progress') }}</h3>
        </template>

        <LoaderComponent />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useOrdersStore } from '@/stores/ordersStore';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';

const route = useRoute();
const router = useRouter();

const cartStore = useCartStore();
const ordersStore = useOrdersStore();

const isSuccess = computed(() => route.name === 'payment-success');
const isCancel = computed(() => route.name === 'payment-cancel');

onMounted(async () => {
    if (isSuccess.value) {
        cartStore.resetCart();
        ordersStore.setOrderOrigin('order');

        setTimeout(() => {
            router.push('/thank-you');
        }, 1500);

        return;
    }

    if (isCancel.value) {
        const orderId = route.query.order_id;

        if (orderId) {
            await ordersStore.cancelOrder(orderId);
        }

        setTimeout(() => {
            router.push('/account');
        }, 2000);
    }
});
</script>
