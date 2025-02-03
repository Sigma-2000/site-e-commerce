<template>
    <div class="account-view">
        <div class="underline-short"></div>
        <h2>{{ $t('menu.account') }}</h2>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome-admin') }}</h3>
        <h3>{{ $t('panel-admin.want-to-do') }}</h3>
        <img src="/images/autoportrait.jpg" alt="autoportrait painting" class="img-account" />
        <div class="underline-center"></div>
        <i18n-t keypath="account.number-orders" tag="span" class="order-admin-number">
            <template #count
                ><strong>{{ totalOrdersInprogress.length }}</strong></template
            >
        </i18n-t>
        <ModificateOrders />
        <div class="account-underline-center"></div>
        <ModificateArtworksProducts />
    </div>
</template>

<script setup>
import ModificateArtworksProducts from '@/components/panel-admin/ModificateArtworksProducts.vue';
import ModificateOrders from '@/components/panel-admin/ModificateOrders.vue';
import { useOrdersStore } from '@/stores/ordersStore';
import { onMounted, computed } from 'vue';

const orderStore = useOrdersStore();

const totalOrdersInprogress = computed(() =>
    orderStore.orders.filter((order) => order.status_order !== 'cancelled')
);

onMounted(() => {
    orderStore.fetchAllOrders();
});
</script>
<style>
.order-admin-number {
    text-align: center;
}
</style>
