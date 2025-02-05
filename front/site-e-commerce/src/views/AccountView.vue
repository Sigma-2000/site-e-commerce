<template>
    <div class="account-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome') }} {{ firstName }}</h3>
        <img src="/images/souffre-d-ete.jpg" alt="souffre d'été painting" class="img-account" />
        <div class="account-underline-center"></div>
        <p v-if="cartItems.length" class="cart-account">
            {{ $t('cart.purchase') }}
            <router-link to="/cart">{{ $t('cart.go-to-cart') }}</router-link>
        </p>
        <div v-if="validOrders.length > 0" class="order-historic">
            <i18n-t keypath="account.number-orders" tag="span" class="order-number">
                <template #count
                    ><strong>{{ validOrders.length }}</strong></template
                >
            </i18n-t>
            <div v-for="order in ordersWithImagesAndStatus" :key="order.id">
                <div class="order-historic-details">
                    <div class="product-details">
                        <div v-for="product in order.products" :key="product.id">
                            <img :src="product.image" alt="product image" class="order-image" />
                            <p>{{ $t('order.quantity') }} {{ product.quantity }}</p>
                        </div>
                    </div>
                    <div class="order-text">
                        <p>
                            {{ $t('order.date') }} <strong>{{ order.formattedDate }}</strong>
                        </p>
                        <p>
                            {{ $t('account.status-order') }}
                            <strong>{{ $t(`order-status.${order.status}`) }}</strong>
                        </p>
                        <p>
                            {{ $t('order.amount') }} <strong>{{ order.amount }} €</strong>
                        </p>
                    </div>
                </div>
                <div class="account-underline-center"></div>
            </div>
        </div>
        <div v-else class="no-order">
            <p>{{ $t('account.no-order') }}</p>
        </div>
        <div v-if="cancelledOrders.length > 0" class="order-cancelled">
            <i18n-t keypath="account.cancelled-orders" tag="span">
                <template #cancelledCount
                    ><strong>{{ cancelledOrders.length }}</strong></template
                >
            </i18n-t>
            <div class="account-underline-center"></div>
        </div>
        <div v-if="!validOrders.length && !cancelledOrders.length" class="account-underline-center">
            <!-- no orders historic -->
        </div>
    </div>
    <AdressUpdate />
    <AccountDelete />
</template>

<script setup>
import AccountDelete from '@/components/account/AccountDelete.vue';
import AdressUpdate from '@/components/account/AddressUpdate.vue';
import { useUsersStore } from '@/stores/usersStore';
import { useCartStore } from '@/stores/cartStore.js';
import { onMounted, computed } from 'vue';
import { formatDate } from '@/utils/helpers.js';

const usersStore = useUsersStore();
const cartStore = useCartStore();

const resetGlobalError = () => {
    usersStore.resetErrorSuccess();
};
const firstName = usersStore.userInformation.firstName;
const orders = usersStore.userInformation.orders;

const cartItems = computed(() => cartStore.cart);
const validOrders = computed(() => orders.filter((order) => order.status_order !== 'cancelled'));
const cancelledOrders = computed(() =>
    orders.filter((order) => order.status_order === 'cancelled')
);

const ordersWithImagesAndStatus = computed(() =>
    validOrders.value.map((order) => ({
        id: order._id,
        status: order.status_order,
        amount: order.total_price,
        formattedDate: formatDate(order.order_date),
        products: order.products.map((product) => ({
            id: product.id?._id || 'unknown',
            image: product.id?.artwork_id?.images[0] || 'unknown',
            quantity: product.quantity || 'unknown',
        })),
        //image: order.products[0]?.id?.artwork_id?.images[4],
    }))
);

onMounted(() => resetGlobalError());
</script>
