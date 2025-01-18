<template>
    <div class="sign-up-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('auth.sign-up') }}</h3>
        <img src="/images/minotaure.jpg" alt="minotaure painting" class="sign-up-img" />
        <ErrorComponent v-if="error" :error="error" />
        <ErrorComponent v-if="emailError" :error="emailError" />
        <ErrorComponent v-if="passwordError" :error="passwordError" />
        <ErrorComponent v-if="phoneError" :error="phoneError" />
        <form @submit.prevent="handleSignUp" class="register-form">
            <input v-model="form.firstName" :placeholder="$t('auth.first-name')" required />
            <input v-model="form.lastName" :placeholder="$t('auth.last-name')" required />
            <input
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.email')"
                :class="{ invalid: emailError }"
                required
            />
            <input
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.password')"
                :class="{ invalid: passwordError }"
                required
            />
            <input v-model="form.address.street" :placeholder="$t('auth.street')" required />
            <input v-model="form.address.city" :placeholder="$t('auth.city')" required />
            <input
                v-model="form.address.postal_code"
                :placeholder="$t('auth.postal-code')"
                required
            />
            <input v-model="form.address.country" :placeholder="$t('auth.country')" required />
            <input
                v-model="form.address.phone"
                :placeholder="$t('auth.phone')"
                :class="{ invalid: phoneError }"
                required
            />
            <label>
                <input type="checkbox" required class="checkbox-user-data" />
                {{ $t('auth.user-data-consent') }}
            </label>
            <ButtonComponent type="submit" class="register-button">{{
                $t('auth.create-account')
            }}</ButtonComponent>
        </form>
        <div class="register-underline-center"></div>
        <p class="login-link">
            {{ $t('auth.already-account') }}
            <router-link to="/sign-in">{{ $t('auth.login') }}</router-link>
        </p>
    </div>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue';
import { validateEmail, validatePassword, validatePhone } from '@/utils/validators';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import { useUsersStore } from '@/stores/usersStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const usersStore = useUsersStore();
const error = computed(() => usersStore.error);

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: {
        street: '',
        city: '',
        postal_code: '',
        country: '',
        phone: '',
    },
});

const emailError = ref(null);
const passwordError = ref(null);
const phoneError = ref(null);
const isEmailUsed = ref(false);
const isPasswordUsed = ref(false);
const isPhoneUsed = ref(false);

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
watch(
    () => form.address.phone,
    (newPhone) => {
        phoneError.value = validatePhone(newPhone);
        isPhoneUsed.value = !!newPhone;
        resetGlobalError();
    }
);

const handleSignUp = async () => {
    if (emailError.value || passwordError.value || phoneError.value) {
        return;
    }
    try {
        await usersStore.signUp(form);
        router.push('/thank-you');
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => resetGlobalError());
</script>
