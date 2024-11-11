<template>
    <header>
        <HeaderComponent />
    </header>
    <main>
        <RouterView />
    </main>
    <footer>
        <FooterComponent />
    </footer>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
</script>

<!--displace that in menu Component

        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav>
-->

<style scoped></style>
