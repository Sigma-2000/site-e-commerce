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
            <section class="item-details-card">
                <h2>{{ artwork.title }}</h2>
                <div class="detail-card-main-image">
                    <img
                        v-if="artwork.images && artwork.images.length"
                        :src="artwork.images[0]"
                        :alt="artwork.title"
                    />
                </div>
                <div class="item-details-card-text">
                    <div class="item-details-card-text-additional">
                        <p>
                            <strong>{{ $t('detail.dimensions') }}: </strong>
                            {{ artwork.dimensions }}
                        </p>
                        <!--<strong>{{ $t('detail.techniques') }}: </strong>techniques add back !-->
                        <!--TODO available in original or print ? add back?-->
                    </div>
                    <p>
                        <strong>{{ $t('detail.description') }}: </strong>{{ artwork.description }}
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { axiosCaller } from '@/services/axiosCaller';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const artwork = ref({});
const error = ref(null);
const category = route.params.category;

const fetchDetailsArtwork = async () => {
    const id = route.params.id;
    try {
        const response = await axiosCaller.get(`/artworks/${id}`);
        console.log(response.data);
        artwork.value = response.data;
    } catch (err) {
        console.error(err);
        error.value = 'errors.display-element';
    }
};

onMounted(async () => {
    fetchDetailsArtwork();
});
</script>
