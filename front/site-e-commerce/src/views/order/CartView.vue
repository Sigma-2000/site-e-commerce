<template>
    <div class="cart-view">
        <h2>{{ $t('cart.title') }}</h2>
        <!--TODO: + and - for user could adjust quantity-->
        <SuccessComponent v-if="successCart" :success="successCart" />
        <ErrorComponent v-if="errorCart" :error="errorCart" />
        <div v-if="cartItems.length">
            <ul>
                <li v-for="item in cartItems" :key="item.id">
                    <img :src="item.image" :alt="item.title" />
                    <h3>{{ item.title[locale] }}</h3>
                    <p>{{ item.price }} €</p>
                    <p>{{ $t('order.quantity') }} {{ item.quantity }}</p>

                    <button @click="removeFromCart(item.id)">
                        <Icon icon="material-symbols-light:close" width="36" height="36" />
                    </button>
                </li>
            </ul>
        </div>
        <div v-if="cartItems.length">
            <p>
                <strong>{{ $t('cart.amount') }} {{ cartTotalPrice }} €</strong>
            </p>
        </div>
        <p v-else>{{ $t('cart.empty') }}</p>
    </div>
    <h3>{{ $t('cart.login') }}</h3>
    <LoginForm />
</template>
<script setup>
import { onMounted, computed } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useCartStore } from '@/stores/cartStore.js';
import { Icon } from '@iconify/vue';

//import { useProductsStore } from '@/stores/productsStore';
import { useI18n } from 'vue-i18n';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';

const { locale } = useI18n();
//recovery userconnection for display login or not
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cart);
const cartTotalPrice = computed(() => cartStore.totalPrice);
const successCart = computed(() => cartStore.success);
const errorCart = computed(() => cartStore.error);

const removeFromCart = async (id) => {
    cartStore.removeFromCart(id);
    console.log(cartStore.totalPrice);
};

onMounted(() => {
    cartStore.resetErrorSuccess();
    cartStore.loadCart();
});

//when user is logged we can display adress component and welcome phrase
//TODO: need to modify the login component for not sending in account page
//when the is register logic different account and message for end up the cart ?
</script>
