<template>
    <div class="thank-you-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3 v-if="isFromOrder">{{ $t('order.thanks') }}</h3>
        <p v-if="isFromOrder" class="order-thanks">
            {{ $t('order.thanks-info') }}
            <router-link to="/account" @click="orderStore.resetOrderOrigin">{{
                $t('menu.account')
            }}</router-link>
        </p>
        <div v-else>
            <h3>{{ $t('auth.thanks') }}</h3>
            <p class="first-login-link">
                <router-link to="/sign-in">{{ $t('auth.login') }}</router-link>
            </p>
            <p v-if="cartItems.length" class="first-login-link">
                <router-link to="/cart">{{ $t('cart.connect-purchase') }}</router-link>
            </p>
        </div>
        <img src="/images/souffre-d-ete.jpg" alt="souffre d'été painting" class="thank-you-img" />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cartStore.js';
import { useOrdersStore } from '@/stores/ordersStore';

const cartStore = useCartStore();
const orderStore = useOrdersStore();

const cartItems = computed(() => cartStore.cart);
const isFromOrder = computed(() => orderStore.orderOrigin === 'order');
</script>
