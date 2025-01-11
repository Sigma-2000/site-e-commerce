<template>
    <div class="panel-admin-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome-admin') }}</h3>
        <img src="/images/autoportrait.jpg" alt="autoportrait painting" class="admin-img-account" />
        <div class="account-underline-center"></div>
        <div class="account-underline-center"></div>
        <i18n-t keypath="account.number-orders">
            <template #count
                ><strong>{{ orderCountAdmin }}</strong></template
            >
        </i18n-t>
        <div class="account-underline-center"></div>
    </div>
</template>

<script setup>
const orderCountAdmin = 5; //TODO need to modifiy this static variable when back is set up
//TODO store for order ?
</script>
