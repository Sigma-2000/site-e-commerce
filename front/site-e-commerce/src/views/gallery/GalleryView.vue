<template>
    <div class="gallery-view">
        <div class="categories-overview">
            <div class="underline-short"></div>
            <router-link to="/" class="pages-link">
                <h2>{{ $t('menu.gallery') }}</h2>
            </router-link>
            <div class="underline-long"></div>
            <div v-if="isAdmin" class="admin-category-choice">
                <h3>{{ $t('account.welcome-admin') }}</h3>
                <p>{{ $t('panel-admin.choice-categories') }}</p>
            </div>
            <div class="categories-items">
                <div v-for="category in galleryCategories" :key="category.name">
                    <router-link
                        :to="{ name: 'gallery-category', params: { category: category.name } }"
                        class="pages-link"
                    >
                        <h3>{{ t(`categories.${category.name}`) }}</h3>
                    </router-link>
                    <div class="underline-extra-short"></div>
                    <div class="category-image">
                        <router-link
                            :to="{ name: 'gallery-category', params: { category: category.name } }"
                        >
                            <img :src="category.galleryImage" :alt="category.label" />
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
import { galleryCategories } from '@/utils/galleryCategories';
import { useUsersStore } from '@/stores/usersStore';
import { computed } from 'vue';

const userStore = useUsersStore();
const isAdmin = computed(() => userStore.userInformation?.role === 'admin');
const { t } = useI18n();
</script>
