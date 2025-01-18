<template>
    <div class="account-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome-admin') }}</h3>
        <h3>{{ $t('panel-admin.want-to-do') }}</h3>
        <img src="/images/autoportrait.jpg" alt="autoportrait painting" class="img-account" />
        <div class="account-underline-center"></div>
        <i18n-t keypath="account.number-orders" tag="span" class="order-number">
            <template #count
                ><strong>{{ orderCountAdmin }}</strong></template
            >
        </i18n-t>
        <div class="account-underline-center"></div>
        <ModificateArtworksProducts />
    </div>
</template>

<script setup>
import ModificateArtworksProducts from '@/components/panel-admin/ModificateArtworksProducts.vue';
const orderCountAdmin = 5; //TODO need to modifiy this static variable when back is set up
//TODO store for order ?
</script>
