<template>
    <div class="reset-password-form-view">
        <ErrorComponent v-if="passwordError" :error="passwordError" />

        <ErrorComponent v-if="confirmationError" :error="confirmationError" />

        <ErrorComponent v-if="resetError" :error="resetError" />

        <SuccessComponent v-if="success" :success="success" />
        <form v-else @submit.prevent="handleSubmit" class="reset-password-form">
            <div class="password-input-wrapper">
                <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.new-password')"
                    :class="{ invalid: passwordError }"
                    required
                />

                <button
                    type="button"
                    class="password-visibility-button"
                    :aria-label="
                        showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                    "
                    @click="showPassword = !showPassword"
                >
                    <Icon
                        :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                        width="20"
                    />
                </button>
            </div>

            <div class="password-input-wrapper">
                <input
                    v-model="form.passwordConfirmation"
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    :placeholder="$t('auth.confirm-password')"
                    :class="{ invalid: confirmationError }"
                    required
                />

                <button
                    type="button"
                    class="password-visibility-button"
                    :aria-label="
                        showPasswordConfirmation
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                    "
                    @click="showPasswordConfirmation = !showPasswordConfirmation"
                >
                    <Icon
                        :icon="showPasswordConfirmation ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                        width="20"
                    />
                </button>
            </div>

            <ButtonComponent type="submit" class="reset-password-button">
                {{ $t('auth.reset-password') }}
            </ButtonComponent>
        </form>

        <div class="login-underline-center"></div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { reactive, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/usersStore.js';
import { validatePassword } from '@/utils/validators';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const token = computed(() => route.query.token);

const form = reactive({
    password: '',
    passwordConfirmation: '',
});

const passwordError = ref(null);
const confirmationError = ref(null);
const resetError = ref(null);
const success = ref(null);
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const handleSubmit = async () => {
    passwordError.value = validatePassword(form.password);

    confirmationError.value = null;
    resetError.value = null;

    if (form.password !== form.passwordConfirmation) {
        confirmationError.value = 'errors.password-confirmation';

        return;
    }

    if (passwordError.value) {
        return;
    }

    if (!token.value || typeof token.value !== 'string') {
        resetError.value = 'errors.invalid-reset-link';

        return;
    }

    try {
        await usersStore.resetPassword(token.value, form.password, form.passwordConfirmation);

        success.value = 'success.reset-password';

        setTimeout(() => {
            router.push('/sign-in');
        }, 3000);
    } catch (error) {
        resetError.value = 'errors.invalid-reset-link';

        console.error(error);
    }
};
</script>
