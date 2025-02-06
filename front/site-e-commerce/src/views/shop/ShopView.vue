<template>
    <div class="gallery-view">
        <div class="categories-overview">
            <div class="underline-short"></div>
            <router-link to="/" class="pages-link">
                <h2>{{ $t('menu.shop') }}</h2>
            </router-link>
            <div class="underline-long"></div>
            <div v-if="isAdmin" class="admin-category-choice">
                <h3>{{ $t('account.welcome-admin') }}</h3>
                <p>{{ $t('panel-admin.choice-categories') }}</p>
            </div>
            <div class="categories-items">
                <div v-for="category in shopCategories" :key="category.name">
                    <router-link
                        :to="{ name: 'shop-category', params: { category: category.name } }"
                        class="pages-link"
                    >
                        <h3>{{ t(`shop-categories.${category.name}`) }}</h3>
                    </router-link>
                    <div class="underline-extra-short"></div>
                    <div class="category-image">
                        <router-link
                            :to="{ name: 'shop-category', params: { category: category.name } }"
                        >
                            <img :src="category.shopImage" :alt="category.label" />
                        </router-link>
                    </div>
                    <div class="underline-ultra-long"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { shopCategories } from '@/utils/shopCategories';
import { computed } from 'vue';
import { useUsersStore } from '@/stores/usersStore';

const userStore = useUsersStore();
const { t } = useI18n();

const isAdmin = computed(() => userStore.userInformation?.role === 'admin');
</script>
