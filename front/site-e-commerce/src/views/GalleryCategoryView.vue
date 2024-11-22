<template>
    <div class="category-view">
        <h1>{{ t(`categories.${category}`) }}</h1>
        <div class="category-content">
            <component :is="currentComponent" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import PaintingGallery from '@/components/categoryGalleryComponents/PaintingGallery.vue';
import DigitalArtGallery from '@/components/categoryGalleryComponents/DigitalArtGallery.vue';
import PhotographyGallery from '@/components/categoryGalleryComponents/PhotographyGallery.vue';
import GraffitiGallery from '@/components/categoryGalleryComponents/GraffitiGallery.vue';

const route = useRoute();
const { t } = useI18n();
const category = route.params.category;

const components = {
    painting: PaintingGallery,
    'digital-art': DigitalArtGallery,
    photography: PhotographyGallery,
    graffiti: GraffitiGallery,
};

const currentComponent = components[category] || null;
</script>
