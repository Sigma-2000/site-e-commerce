<template>
    <div class="forgot-password-view">
        <div class="underline-short"></div>

        <h2>
            <RouterLink to="/sign-in">
                {{ $t('menu.account') }}
            </RouterLink>
        </h2>

        <div class="underline-long"></div>

        <h3>{{ $t('auth.forgot-password') }}</h3>
        <img
            src="/images/serenade-optimized.webp"
            alt="Sérénade, peinture de Sigma2000"
            class="forgot-img"
            decoding="async"
        />

        <ForgotPasswordForm />
    </div>
</template>
<script setup>
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
</script>
