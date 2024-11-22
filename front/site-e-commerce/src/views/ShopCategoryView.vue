<template>
    <div class="category-view">
        <h1>{{ t(`shop-categories.${category}`) }}</h1>
        <div class="category-content">
            <component :is="currentComponent" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import PrintShop from '@/components/categoryShopComponent/PrintShop.vue';
import OriginalsShop from '@/components/categoryShopComponent/OriginalsShop.vue';

const route = useRoute();
const { t } = useI18n();
const category = route.params.category;

const components = {
    print: PrintShop,
    original: OriginalsShop,
};

const currentComponent = components[category] || null;
</script>
