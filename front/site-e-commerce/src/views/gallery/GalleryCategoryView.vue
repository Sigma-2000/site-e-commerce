<template>
    <div class="category-view">
        <div class="underline-short"></div>
        <router-link to="/gallery" class="pages-link">
            <h2>{{ $t('menu.gallery') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="category-content">
            <h3>{{ t(`categories.${category}`) }}</h3>
            <div class="underline-extra-short"></div>
            <section class="category-content-list">
                <ul v-if="filteredArtworks.length && !isLoading">
                    <li v-for="artwork in filteredArtworks" :key="artwork._id">
                        <h2>{{ artwork.title[locale] }}</h2>
                        <p
                            v-if="artwork.products && artwork.products.length > 0"
                            class="shop-available"
                        >
                            <Icon icon="fluent-emoji:framed-picture" />
                            {{ $t('detail.available-shop') }}
                        </p>
                        <div class="category-content-items">
                            <img
                                v-if="artwork.images && artwork.images.length"
                                :src="artwork.images[0]"
                                :alt="artwork.title[locale]"
                            />
                            <div class="category-content-items-more-details">
                                <p>{{ artwork.techniques[locale] }}</p>
                                <router-link
                                    :to="`/gallery/${category}/${artwork._id}`"
                                    class="details-link"
                                >
                                    {{ $t('display.details') }}
                                </router-link>
                            </div>
                        </div>
                        <div class="underline-center"></div>
                    </li>
                </ul>
            </section>
        </div>
        <LoaderComponent v-if="isLoading" />
        <ErrorComponent v-if="error" :error="error" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { axiosCaller } from '@/services/axiosCaller';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const category = route.params.category;
const artworks = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchArtworks = async () => {
    isLoading.value = true;
    try {
        const response = await axiosCaller.get('/artworks');
        console.log(response.data);
        artworks.value = response.data;
    } catch (err) {
        error.value = 'errors.display-list';
        console.error(err);
    } finally {
        isLoading.value = false;
    }
};
/**TODO: Maybe implement a store for api call and data */
const filteredArtworks = computed(() =>
    artworks.value.filter((artwork) => artwork.type === category)
);

onMounted(() => {
    fetchArtworks();
});
</script>
