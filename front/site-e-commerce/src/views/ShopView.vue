<template>
    <div class="gallery-view">
        <div class="categories-overview">
            <div class="underline-short"></div>
            <router-link to="/" class="pages-link">
                <h2>{{ $t('menu.gallery') }}</h2>
            </router-link>
            <div class="underline-long"></div>
            <div class="categories-items">
                <div v-for="category in shopCategories" :key="category.name" class="category-item">
                    <h3>{{ t(`shop-categories.${category.name}`) }}</h3>
                    <div class="underline-extra-short"></div>
                    <router-link
                        :to="{ name: 'shop-category', params: { category: category.name } }"
                    >
                        <img :src="category.shopImage" :alt="category.label" />
                    </router-link>
                    <div class="underline-ultra-long"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { shopCategories } from '@/utils/shopCategories';

const { t } = useI18n();
</script>
