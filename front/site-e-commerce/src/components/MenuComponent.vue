<template>
    <div v-if="isVisible" class="menu-popup">
        <div class="menu-item">
            {{ $t('menu.home') }}
        </div>
        <div class="menu-item">
            {{ $t('menu.gallery') }}
        </div>
        <div class="menu-item">
            {{ $t('menu.shop') }}
        </div>
        <div class="menu-item">
            {{ $t('menu.about') }}
        </div>
        <div class="menu-item">
            {{ isLoggedIn ? $t('menu.logout') : $t('menu.account') }}
        </div>
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
