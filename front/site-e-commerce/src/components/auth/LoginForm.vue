<template>
    <div class="login-form-view">
        <ErrorComponent v-if="error" :error="error" />
        <ErrorComponent v-if="emailError" :error="emailError" />
        <ErrorComponent v-if="passwordError" :error="passwordError" />
        <form @submit.prevent="handleLogin" class="login-form">
            <input
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.email')"
                :class="{ invalid: emailError }"
                required
            />
            <div class="password-input-wrapper">
                <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.password')"
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
            <ButtonComponent type="submit" class="login-button">{{
                $t('auth.login')
            }}</ButtonComponent>
        </form>
        <p class="forgot-password-link">
            <router-link to="/forgot-password">
                {{ $t('auth.forgot-password') }}
            </router-link>
        </p>
        <div class="login-underline-center"></div>
        <p class="create-account-link">
            {{ $t('auth.no-account') }}
            <router-link to="/sign-up">{{ $t('auth.create-account') }}</router-link>
        </p>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ErrorComponent from '../ui/ErrorComponent.vue';
import { useUsersStore } from '@/stores/usersStore.js';
import { reactive, watch, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { validateEmail, validatePassword } from '@/utils/validators';

const usersStore = useUsersStore();
const router = useRouter();

const error = computed(() => usersStore.error);

const form = reactive({
    email: '',
    password: '',
});

const emailError = ref(null);
const passwordError = ref(null);
const isEmailUsed = ref(false);
const isPasswordUsed = ref(false);
const showPassword = ref(false);

const resetGlobalError = () => {
    usersStore.resetErrorSuccess();
};

watch(
    () => form.email,
    (newEmail) => {
        emailError.value = validateEmail(newEmail);
        isEmailUsed.value = !!newEmail;
        resetGlobalError();
    }
);

watch(
    () => form.password,
    (newPassword) => {
        passwordError.value = validatePassword(newPassword);
        isPasswordUsed.value = !!newPassword;
        resetGlobalError();
    }
);
/*
const handleLogin = async () => {
    if (emailError.value || passwordError.value) {
        return;
    }
    try {
        await usersStore.login({ email: form.email, password: form.password });

        if (usersStore.userInformation.role === 'admin') {
            router.push('/panel-admin');
        } else if (usersStore.loginOrigin === 'cart') {
            await usersStore.fetchUser();
            router.push('/cart');
            usersStore.resetLoginOrigin();
        } else {
            router.push('/account');
        }
    } catch (error) {
        console.error(error);
    }
};*/
const handleLogin = async () => {
    emailError.value = validateEmail(form.email);
    passwordError.value = validatePassword(form.password);

    if (emailError.value || passwordError.value) {
        return;
    }

    const loggedIn = await usersStore.login({
        email: form.email,
        password: form.password,
    });

    if (!loggedIn) {
        return;
    }

    if (usersStore.userInformation.role === 'admin') {
        router.push('/panel-admin');
        return;
    }

    if (usersStore.loginOrigin === 'cart') {
        await usersStore.fetchUser();

        router.push('/cart');

        usersStore.resetLoginOrigin();

        return;
    }

    router.push('/account');
};
onMounted(() => resetGlobalError());
</script>
