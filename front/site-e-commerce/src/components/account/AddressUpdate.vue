<template>
    <div v-if="address" class="update-address">
        <h3>
            {{ $t('account.address') }}
            <Icon
                icon="fluent-mdl2:field-not-changed"
                class="modify-icon"
                @click="toggleEditMode"
            />
        </h3>
        <div v-if="!isEditing" class="cart-address">
            <p>{{ firstName }} {{ lastName }}</p>
            <p>{{ address.street }}</p>
            <p>{{ address.postal_code }} {{ address.city }}</p>
            <p>{{ address.country }}</p>
            <p>{{ address.phone }}</p>
        </div>
        <form v-else @submit.prevent="handleSubmit" class="address-form">
            <input v-model="form.street" type="text" placeholder="Street" required />
            <input v-model="form.postal_code" type="text" placeholder="Postal Code" required />
            <input v-model="form.city" type="text" placeholder="City" required />
            <input v-model="form.country" type="text" placeholder="Country" required />
            <input
                v-model="form.phone"
                type="text"
                placeholder="Phone"
                :class="{ invalid: phoneError }"
                required
            />
            <ButtonComponent type="submit" class="update-button">{{
                $t('button.update')
            }}</ButtonComponent>
        </form>
        <ErrorComponent v-if="phoneError" :error="phoneError" />
        <ErrorComponent v-if="error" :error="error" />
        <SuccessComponent v-if="success" :success="success" />
    </div>
</template>
<script setup>
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { validatePhone } from '@/utils/validators';
import { Icon } from '@iconify/vue';
import { useUsersStore } from '@/stores/usersStore';
import { ref, reactive, computed, watch } from 'vue';

const usersStore = useUsersStore();

const firstName = usersStore.userInformation.firstName;
const lastName = usersStore.userInformation.lastName;
const address = computed(() => usersStore.userInformation.address_id);
const success = computed(() => usersStore.success);
const error = computed(() => usersStore.error);

const isEditing = ref(false);
const isPhoneUsed = ref(false);
const phoneError = ref(null);

const form = reactive({
    street: '',
    postal_code: '',
    city: '',
    country: '',
    phone: '',
});

watch(
    () => form.phone,
    (newPhone) => {
        phoneError.value = validatePhone(newPhone);
        isPhoneUsed.value = !!newPhone;
    }
);

const toggleEditMode = () => {
    isEditing.value = !isEditing.value;
};

const handleSubmit = async () => {
    if (phoneError.value) {
        return;
    }
    await usersStore.updateAddress(form);
    if (!usersStore.error) {
        isEditing.value = false;
    }
};
</script>
