<template>
    <div class="content-top-menu">
        <div class="content-top-menu-logo">
            <div class="logo-underline"></div>
            - <img src="/images/sigma-logo.png" alt="Sigma.2000" class="menu-logo" /> -
            <div class="logo-underline"></div>
        </div>
        <div class="content-top-menu-icon">
            <Icon icon="ph:shopping-cart-thin" width="24" class="menu-cart-icon" />
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
</script>
