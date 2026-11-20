<template>
    <div class="home">
        <div class="home-banner">
            <img
                src="/images/banner-nightmare-960.webp"
                srcset="
                    /images/banner-nightmare-640.webp   640w,
                    /images/banner-nightmare-960.webp   960w,
                    /images/banner-nightmare-1440.webp 1440w
                "
                sizes="95vw"
                width="2044"
                height="948"
                alt="Nightmare, œuvre de Sigma2000"
                class="home-banner-img"
                fetchpriority="high"
                loading="eager"
                decoding="async"
            />
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
                    :to="{
                        name: 'gallery-category',
                        params: { category: category.name },
                    }"
                >
                    <img
                        :src="getHomeImage(category.image)"
                        :srcset="getHomeSrcset(category.image)"
                        sizes="(max-width: 767px) 45vw, 40vw"
                        :alt="category.label"
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                    />
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
                    :to="{
                        name: 'shop-category',
                        params: { category: category.name },
                    }"
                >
                    <img
                        :src="getHomeImage(category.image)"
                        :srcset="getHomeSrcset(category.image)"
                        sizes="(max-width: 767px) 45vw, 40vw"
                        :alt="category.label"
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                    />
                </router-link>
            </div>

            <div class="logo-underline-short"></div>

            <router-link to="/about" class="pages-link">
                <h2>{{ $t('menu.about') }}</h2>
            </router-link>

            <div class="logo-underline-long"></div>

            <div class="about-img">
                <router-link to="/about">
                    <img
                        src="/images/sigma-2000-photo-640.webp"
                        srcset="
                            /images/sigma-2000-photo-320.webp 320w,
                            /images/sigma-2000-photo-640.webp 640w,
                            /images/sigma-2000-photo-960.webp 960w
                        "
                        sizes="(max-width: 767px) 45vw, 40vw"
                        width="1365"
                        height="902"
                        alt="Portrait de l'artiste Sigma2000"
                        loading="lazy"
                        decoding="async"
                    />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { galleryCategories } from '@/utils/galleryCategories';
import { shopCategories } from '@/utils/shopCategories';

// Images dont les variantes WebP ont été générées.
// On conserve l'image originale si elle ne fait
// pas partie de cette liste.
const optimizedImages = new Set([
    'idolomantis-diabolica-cut',
    'ecoulement-du-temps-cut',
    'dust-and-body-waterfall-cut',
    'print-overview',
    'sigma-2000-photo',
]);

const getImageBase = (src) => {
    if (typeof src !== 'string') return null;

    const match = src.match(/^\/images\/([^/]+)\.(jpg|jpeg|png)$/i);

    if (!match || !optimizedImages.has(match[1])) {
        return null;
    }

    return `/images/${match[1]}`;
};

const getHomeImage = (src) => {
    const base = getImageBase(src);
    return base ? `${base}-640.webp` : src;
};

const getHomeSrcset = (src) => {
    const base = getImageBase(src);

    if (!base) return undefined;

    return [`${base}-320.webp 320w`, `${base}-640.webp 640w`].join(', ');
};
</script>
