<template>
    <div v-if="isVisible" class="menu-popup">
        <router-link to="/" class="menu-item">
            {{ $t('menu.home') }}
        </router-link>

        <router-link to="/gallery" class="menu-item">
            {{ $t('menu.gallery') }}
        </router-link>

        <router-link to="/shop" class="menu-item">
            {{ $t('menu.shop') }}
        </router-link>

        <router-link to="/about" class="menu-item">
            {{ $t('menu.about') }}
        </router-link>
        <router-link to="/sign-in" class="menu-item">
            {{ isLoggedIn ? $t('menu.logout') : $t('menu.account') }}
        </router-link>
    </div>
</template>

<script setup>
import { ref } from 'vue';
//import { useRouter } from 'vue-router';

defineProps({
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const isLoggedIn = ref(false);
/*
make a connect function/disconnect router link
const router = useRouter(); */
</script>
