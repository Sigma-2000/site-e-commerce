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
    cartStore.loadCart(); //maybe in app ??
});

//une fois loguer on l'envoie pas sur son compte (ou alors autre fenetre ??) et on va passer au paiement
//ou mettre en place un truc en mode ok il a un panier du coup lien pour finaliser le paiement ??
//il se passe quoi si le gars s'inscrit pareil mettre en place un userHasCart dans store ?
</script>
