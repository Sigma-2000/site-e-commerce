<template>
    <div class="delete-account">
        <ErrorComponent v-if="error" :error="error" />
        <div class="account-underline-center"></div>
        <p class="delete-link" @click="deleteAccount">
            {{ $t('account.delete-account') }}
        </p>
        <p>{{ $t('account.rgpd') }}</p>
    </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/usersStore.js';
import { useRouter } from 'vue-router';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import { computed } from 'vue';

const usersStore = useUsersStore();
const router = useRouter();
const error = computed(() => usersStore.error);

const deleteAccount = async () => {
    try {
        await usersStore.deleteAccount();
        router.push('/sign-in');
    } catch (err) {
        console.error(err);
    }
};
</script>
