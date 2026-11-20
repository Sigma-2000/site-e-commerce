<template>
    <div class="sign-in-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('auth.sign-in') }}</h3>
        <img
            src="/images/serenade-optimized.webp"
            alt="Sérénade, peinture de Sigma2000"
            class="sign-in-img"
            decoding="async"
        />
    </div>
    <LoginForm />
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue';
import { onMounted } from 'vue';
import { useUsersStore } from '@/stores/usersStore';

const usersStore = useUsersStore();

onMounted(() => {
    usersStore.resetLoginOrigin();
});
</script>
