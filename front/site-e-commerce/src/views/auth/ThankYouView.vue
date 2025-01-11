<template>
    <div class="thank-you-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('auth.thanks') }}</h3>
        <p class="first-login-link">
            <router-link to="/sign-in">{{ $t('auth.login') }}</router-link>
        </p>
        <img src="/images/souffre-d-ete.jpg" alt="souffre d'été painting" class="thank-you-img" />
        <!--<LoginForm /> just link or form?-->
    </div>
</template>
<script setup>
//import LoginForm from '@/components/auth/LoginForm.vue';
</script>
