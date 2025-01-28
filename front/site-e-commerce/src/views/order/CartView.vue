<template>
    <div class="cart-view">
        <h1>Cart</h1>

        <div v-if="cartItems.length">
            <ul>
                <li v-for="item in cartItems" :key="item.id">
                    <img :src="item.image" :alt="item.title" />
                    <h3>{{ item.title[locale] }}</h3>
                    <p>{{ item.price }} €</p>
                    <p>{{ $t('quantity') }}: {{ item.quantity }}</p>

                    <button @click="removeFromCart(item.id)">Remove</button>
                    <!--rajouter remove quantité héhé-->
                </li>
            </ul>
            <p>
                <strong>Total: {{ cartTotalPrice }} €</strong>
            </p>
        </div>

        <p v-else>Votre panier est vide.</p>
    </div>
    <LoginForm />
</template>
<script setup>
import { onMounted, computed } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useCartStore } from '@/stores/cartStore.js';
import { useProductsStore } from '@/stores/productsStore';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
//recovery userconnection for display login or not
const cartStore = useCartStore();
const productStore = useProductsStore();
const cart = computed(() => cartStore.cart);
const cartItems = computed(() => cartStore.cart);
const cartTotalPrice = computed(() => cartStore.cartTotalPrice);

console.log(cart.value);
const removeFromCart = (id) => {
    cartStore.removeFromCart(id);
    productStore.removeProductFromUnavailable(id);
};

onMounted(() => {
    cartStore.loadCart();
});

//when user is logged we can display adress component and welcome phrase
//TODO: need to modify the login component for not sending in account page
//when the is register logic different account and message for end up the cart ?
//always call validate cart in back end here for ensure local stoage is align !
//delete getter in store for display price waiting the validate order and totalPrice send by back !!
</script>
