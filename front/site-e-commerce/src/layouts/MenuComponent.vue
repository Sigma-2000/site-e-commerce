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
        <template v-if="isLoggedIn">
            <router-link :to="redirectLink" class="menu-item">
                {{ $t('menu.account') }}
            </router-link>
            <div class="menu-item">
                <button @click="logout">
                    {{ $t('menu.logout') }}
                </button>
            </div>
        </template>
        <router-link v-else to="/sign-in" class="menu-item">
            {{ $t('menu.account') }}
        </router-link>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUsersStore } from '@/stores/usersStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const usersStore = useUsersStore();
const isLoggedIn = computed(() => !!usersStore.userInformation);

const redirectLink = computed(() => {
    if (usersStore.userInformation?.role === 'admin') {
        return '/panel-admin';
    }
    return '/account';
});

const logout = async () => {
    try {
        await usersStore.logout();
        router.push('/sign-in');
    } catch (err) {
        console.error(err);
    }
};
</script>
