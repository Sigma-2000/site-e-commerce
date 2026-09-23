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
        <img src="/images/serenade.jpg" alt="sérénade painting" class="forgot-img" />

        <ForgotPasswordForm />
    </div>
</template>
<script setup>
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
</script>
