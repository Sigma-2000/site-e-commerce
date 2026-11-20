<template>
    <div class="reset-password-view">
        <div class="underline-short"></div>

        <h2>
            <RouterLink to="/sign-in">{{ $t('menu.account') }}</RouterLink>
        </h2>

        <div class="underline-long"></div>

        <h3>{{ $t('auth.reset-password') }}</h3>
        <img
            src="/images/daragon-optimized.webp"
            alt="Daragon, peinture de Sigma2000"
            class="reset-img"
            decoding="async"
        />
        <ResetPasswordForm />
    </div>
</template>

<script setup>
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue';
</script>
