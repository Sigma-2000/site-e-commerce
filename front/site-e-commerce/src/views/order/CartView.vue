<template>
    <div class="cart-view">
        <div class="underline-short"></div>
        <router-link to="/shop" class="pages-link">
            <h2>{{ $t('menu.shop') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <h3>{{ $t('cart.title') }}</h3>
        <SuccessComponent v-if="successCart" :success="successCart" />
        <ErrorComponent v-if="errorCart" :error="errorCart" />
        <div v-if="isLoggedIn">
            <h3>{{ $t('account.welcome') }} {{ userName }}</h3>
        </div>
        <div v-if="cartItems.length" class="cart-list">
            <p class="cart-amount">
                {{ $t('cart.amount') }} <strong>{{ cartTotalPrice }} €</strong>
            </p>
            <div class="account-underline-center"></div>
            <ul class="cart-product-list">
                <li v-for="item in cartItems" :key="item.id" class="cart-product-details">
                    <img :src="item.image" :alt="item.title" />
                    <div class="cart-text">
                        <h4>{{ item.title[locale] }}</h4>
                        <p>
                            {{ $t('cart.price') }} <strong>{{ item.price }} € </strong>
                        </p>
                        <div class="cart-product-quantity">
                            <p>
                                {{ $t('order.quantity') }}
                                <button @click="decrementQuantity(item.id)">-</button>
                                <strong>{{ item.quantity }} </strong>
                                <button @click="incrementQuantity(item)">+</button>
                            </p>
                        </div>
                        <p>{{ item.type }}</p>
                        <ButtonComponent @click="removeFromCart(item.id)">
                            {{ $t('cart.delete') }}
                        </ButtonComponent>
                    </div>
                </li>
            </ul>
        </div>
        <p v-else class="no-cart">{{ $t('cart.empty') }}</p>
        <div class="account-underline-center"></div>
        <div v-if="!isLoggedIn">
            <h3 class="title-login-cart">{{ $t('cart.login') }}</h3>
            <LoginForm />
        </div>
        <div v-else>
            <h3 class="title-login-cart">{{ $t('cart.order-address') }}</h3>
            <AddressUpdate />
            <div class="button-purchase">
                <ButtonComponent class="validate-order-button" @click="createOrderAndPayment">
                    {{ $t('button.validate-order') }}
                </ButtonComponent>
            </div>
        </div>
    </div>
</template>
<script setup>
import LoginForm from '@/components/auth/LoginForm.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import AddressUpdate from '@/components/account/AddressUpdate.vue';
import { createOrder, createCheckoutSession } from '@/services/orderPaymentServices';

import { onMounted, computed, watch } from 'vue';
import { useCartStore } from '@/stores/cartStore.js';
import { useUsersStore } from '@/stores/usersStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { locale } = useI18n();
const cartStore = useCartStore();
const usersStore = useUsersStore();
const orderStore = useOrdersStore();
const router = useRouter();

const cartItems = computed(() => cartStore.cart);
const cartTotalPrice = computed(() => cartStore.totalPrice);
const successCart = computed(() => cartStore.success);
const errorCart = computed(() => cartStore.error);
const isLoggedIn = computed(() => !!usersStore.userInformation);
const userName = computed(() => usersStore.userInformation?.firstName);
const userAddress = computed(() => usersStore.userInformation?.address_id);

const removeFromCart = async (id) => {
    cartStore.removeFromCart(id);
};

const decrementQuantity = async (productId) => {
    await cartStore.decreaseQuantity(productId);
};
const incrementQuantity = async (product) => {
    await cartStore.addToCart(product);
};

const createOrderAndPayment = async () => {
    if (!userAddress.value) {
        cartStore.setError('errors.no-address');
        return;
    }
    if (!cartItems.value.length) {
        cartStore.setError('errors.no-products');
        return;
    }
    try {
        const orderData = {
            user_id: usersStore.userInformation.id,
            address_id: userAddress.value,
            products: cartItems.value.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
        };

        const orderResponse = await createOrder(orderData);
        orderStore.setCurrentOrderId(orderResponse._id);
        const paymentData = {
            order_id: orderResponse._id,
            user_id: orderResponse.user_id,
            amount: orderResponse.total_price * 100,
            currency: 'eur',
            products: orderResponse.products,
        };

        const checkoutResponse = await createCheckoutSession(paymentData);
        orderStore.setCurrentSecretClient(checkoutResponse.data.clientSecret);
        if (checkoutResponse) {
            router.push('/payment');
        }
    } catch (error) {
        console.error(error);
        orderStore.setError('errors.order-creation');
    }
};

watch(
    () => cartStore.success,
    (newValue) => {
        if (newValue) {
            setTimeout(() => {
                cartStore.resetErrorSuccess();
            }, 3000);
        }
    }
);

onMounted(() => {
    cartStore.resetErrorSuccess();
    cartStore.loadCart();
    usersStore.setLoginOrigin('cart');
});
</script>
