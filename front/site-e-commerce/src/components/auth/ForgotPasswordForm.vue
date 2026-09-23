<template>
    <div class="forgot-password-form-view">
        <ErrorComponent v-if="emailError" :error="emailError" />
        <ErrorComponent v-if="requestError" :error="requestError" />
        <SuccessComponent v-if="success" :success="success" />

        <form v-else @submit.prevent="handleSubmit" class="forgot-password-form">
            <input
                v-model="email"
                type="email"
                :placeholder="$t('auth.email')"
                :class="{ invalid: emailError }"
                required
            />

            <ButtonComponent type="submit" class="forgot-button">
                {{ $t('auth.send-reset-link') }}
            </ButtonComponent>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsersStore } from '@/stores/usersStore.js';
import { validateEmail } from '@/utils/validators';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';

const usersStore = useUsersStore();

const email = ref('');
const emailError = ref(null);
const requestError = ref(null);
const success = ref(null);

const handleSubmit = async () => {
    emailError.value = validateEmail(email.value);
    requestError.value = null;
    success.value = null;

    if (emailError.value) {
        return;
    }

    try {
        await usersStore.forgotPassword(email.value);

        success.value = 'success.forgot-password';
    } catch (error) {
        requestError.value = 'errors.forgot-password';

        console.error(error);
    }
};
</script>
