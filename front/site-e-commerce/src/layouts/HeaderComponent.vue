<template>
    <div class="content-top-menu">
        <div class="content-top-menu-logo">
            <div class="logo-underline"></div>
            -
            <img
                :src="
                    darkModeStore.isDarkMode
                        ? '/images/sigma-logo-white.png'
                        : '/images/sigma-logo.png'
                "
                alt="Sigma.2000"
                class="menu-logo"
            />
            -
            <div class="logo-underline"></div>
        </div>
        <div class="content-top-menu-icon">
            <RouterLink to="/cart" class="cart-container">
                <Icon icon="ph:shopping-cart-thin" width="24" class="menu-cart-icon" />
                <span v-if="cartItems.length" class="menu-cart-alert"
                    ><Icon icon="noto:red-circle" width="10" height="10"
                /></span>
            </RouterLink>
            <Icon
                :icon="
                    isVisible ? 'fluent:dismiss-24-regular' : 'fluent:line-horizontal-3-20-regular'
                "
                width="24"
                class="menu-burger-icon"
                @click.stop="emit('toggle-menu')"
            />
        </div>
        <MenuComponent :isVisible="isVisible" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import MenuComponent from './MenuComponent.vue';
import { computed } from 'vue';
import { useDarkModeStore } from '@/stores/darkModeStore';
import { useCartStore } from '@/stores/cartStore';

defineProps({
    isVisible: {
        type: Boolean,
        required: true,
    },
    closeMenu: {
        type: Function,
        required: true,
    },
});
const emit = defineEmits(['toggle-menu']);

const darkModeStore = useDarkModeStore();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cart);
</script>
