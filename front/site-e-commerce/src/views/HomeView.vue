<template>
    <div class="home">
        <div class="home-banner">
            <img src="/images/banner-nightmare.jpg" alt="banner-img" class="home-banner-img" />
        </div>
        <div class="home-presentation">
            <div class="logo-underline-long"></div>
            <p>{{ $t('homepage.presentation') }}</p>
            <div class="logo-underline-short"></div>
            <router-link to="/gallery" class="pages-link">
                <h2>{{ $t('menu.gallery') }}</h2>
            </router-link>
            <div class="logo-underline-long"></div>
            <div class="gallery-img">
                <router-link
                    v-for="category in galleryCategories"
                    :key="category.name"
                    :to="{ name: 'gallery-category', params: { category: category.name } }"
                >
                    <img :src="category.image" :alt="category.label" />
                </router-link>
            </div>
            <div class="logo-underline-short"></div>
            <router-link to="/shop" class="pages-link">
                <h2>{{ $t('menu.shop') }}</h2>
            </router-link>
            <div class="logo-underline-long"></div>
            <div class="shop-img">
                <router-link
                    v-for="category in shopCategories"
                    :key="category.name"
                    :to="{ name: 'shop-category', params: { category: category.name } }"
                >
                    <img :src="category.image" :alt="category.label" />
                </router-link>
            </div>
            <div class="logo-underline-short"></div>
            <router-link to="/about" class="pages-link">
                <h2>{{ $t('menu.about') }}</h2>
            </router-link>
            <div class="logo-underline-long"></div>
            <div class="about-img">
                <router-link to="/about">
                    <img src="/images/sigma-2000-photo.jpg" alt="framing-original" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { galleryCategories } from '@/utils/galleryCategories';
import { shopCategories } from '@/utils/shopCategories';
</script>
