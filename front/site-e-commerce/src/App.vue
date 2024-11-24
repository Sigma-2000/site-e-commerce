<template>
    <header class="content-header">
        <HeaderComponent
            :is-visible="isMenuDisplayed"
            :close-menu="closeMenu"
            @toggle-menu="toggleMenu"
        />
    </header>
    <main @click="closeMenu">
        <RouterView />
    </main>
    <footer class="content-footer">
        <FooterComponent />
    </footer>
</template>

<script setup>
import { RouterView } from 'vue-router';
import FooterComponent from '@/components/layouts/FooterComponent.vue';
import HeaderComponent from '@/components/layouts/HeaderComponent.vue';
import { ref } from 'vue';

const isMenuDisplayed = ref(false);

const closeMenu = () => {
    isMenuDisplayed.value = false;
};

const toggleMenu = () => {
    isMenuDisplayed.value = !isMenuDisplayed.value;
};
</script>

<style>
header,
main,
footer {
    width: 100%;
    max-width: 100%;
}
.content-header {
    position: sticky;
    top: 0;
    z-index: 1000;
}

.content-bottom {
    position: sticky;
    top: 0;
    z-index: 1000;
}
</style>
