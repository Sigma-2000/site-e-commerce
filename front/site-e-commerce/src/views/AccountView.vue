<template>
    <div class="account-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome') }} {{ firstName }}</h3>
        <img src="/images/souffre-d-ete.jpg" alt="souffre d'été painting" class="img-account" />
        <div class="account-underline-center"></div>
        <i18n-t keypath="account.number-orders" tag="span" class="order-number">
            <template #count
                ><strong>{{ orderCount }}</strong></template
            >
        </i18n-t>
        <div class="account-underline-center"></div>
    </div>
    <AdressUpdate />
    <AccountDelete />
</template>

<script setup>
import AccountDelete from '@/components/AccountDelete.vue';
import AdressUpdate from '@/components/AddressUpdate.vue';
import { useUsersStore } from '@/stores/usersStore';
import { onMounted } from 'vue';

const usersStore = useUsersStore();
const resetGlobalError = () => {
    usersStore.resetErrorSuccess();
};
const firstName = usersStore.userInformation.firstName;

const orderCount = 2; //TODO need to modifiy this static variable when back is set up
//TODO store for order ?
onMounted(() => resetGlobalError());
</script>
