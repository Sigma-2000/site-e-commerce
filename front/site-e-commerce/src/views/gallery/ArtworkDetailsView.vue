<template>
    <div class="item-details">
        <div class="underline-short"></div>
        <router-link to="/gallery" class="pages-link">
            <h2>{{ $t('menu.gallery') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="item-details-submenu">
            <router-link :to="`/gallery/${category}`" class="pages-link">
                <h3>{{ t(`categories.${category}`) }}</h3>
            </router-link>
            <div class="underline-extra-short"></div>
            <section v-if="artwork._id" class="item-details-card">
                <h2>{{ artwork.title[locale] }}</h2>
                <div class="detail-card-main-image">
                    <video
                        v-if="artwork.videos && artwork.videos.length"
                        :src="artwork.videos[0]"
                        controls
                        :alt="artwork.title[locale]"
                    ></video>
                    <img
                        v-else-if="artwork.images && artwork.images.length"
                        :src="artwork.images[0]"
                        :alt="artwork.title[locale]"
                    />
                    <!--
                    <img
                        v-if="artwork.images && artwork.images.length"
                        :src="artwork.images[0]"
                        :alt="artwork.title[locale]"
                    />
                    -->
                </div>
                <div class="item-details-card-text">
                    <div class="item-details-card-text-additional">
                        <p>
                            <strong>{{ $t('detail.dimensions') }}: </strong>
                            {{ artwork.dimensions }}
                        </p>
                        <p>
                            <strong>{{ $t('detail.techniques') }}: </strong>
                            {{ artwork.techniques[locale] }}
                        </p>
                        <p
                            v-if="artwork.products && artwork.products.length > 0"
                            class="shop-available"
                        >
                            <Icon icon="fluent-emoji:framed-picture" />
                            {{ $t('detail.available-shop') }}
                        </p>
                    </div>
                    <p>
                        <strong>{{ $t('detail.description') }}: </strong
                        >{{ artwork.description[locale] }}
                    </p>
                </div>
                <div class="detail-card-images" v-if="artwork.images && artwork.images.length > 1">
                    <img
                        v-for="(image, index) in artwork.images.slice(1)"
                        :key="index"
                        :src="image"
                        :alt="`${artwork.title} - ${index}`"
                        class="detail-image"
                    />
                </div>
            </section>
            <ErrorComponent v-if="error" :error="error" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { Icon } from '@iconify/vue';
import { useArtworksStore } from '@/stores/artworksStore';

const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const artworkStore = useArtworksStore();

const artworkId = route.params.id;
const category = route.params.category;

const artwork = computed(() => artworkStore.selectedArtwork);
const error = computed(() => artworkStore.error);

onMounted(async () => {
    artworkStore.fetchArtworkById(artworkId);
});
</script>
