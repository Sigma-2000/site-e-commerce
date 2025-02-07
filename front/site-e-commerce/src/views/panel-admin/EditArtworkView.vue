<template>
    <div class="edit-view">
        <div class="underline-short"></div>
        <router-link to="/gallery" class="pages-link">
            <h2>{{ $t('menu.gallery') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="edit-submenu">
            <router-link :to="`/gallery/${category}`" class="pages-link">
                <h3>{{ t(`categories.${category}`) }}</h3>
            </router-link>
            <div class="underline-extra-short"></div>
        </div>
        <section class="edit-card">
            <h2>{{ t('form-artworks.update') }}</h2>
            <div v-if="artwork._id">
                <h3>{{ artwork.title[locale] }}</h3>
                <div class="edit-image">
                    <img
                        v-if="artwork.images && artwork.images.length"
                        :src="artwork.images[0]"
                        :alt="artwork.title[locale]"
                    />
                </div>
            </div>
            <div class="edit-card-text">
                <form @submit.prevent="submitForm" class="edit-form">
                    <input
                        v-model="formArtwork.title_fr"
                        type="text"
                        :placeholder="$t('form-artworks.title-fr')"
                        required
                    />
                    <input
                        v-model="formArtwork.title_en"
                        type="text"
                        :placeholder="$t('form-artworks.title-en')"
                        required
                    />
                    <input
                        v-model="formArtwork.techniques_fr"
                        type="text"
                        :placeholder="$t('form-artworks.techniques-fr')"
                    />
                    <input
                        v-model="formArtwork.techniques_en"
                        type="text"
                        :placeholder="$t('form-artworks.techniques-en')"
                    />
                    <input
                        v-model="formArtwork.dimensions"
                        type="text"
                        :placeholder="$t('form-artworks.dimensions')"
                    />
                    <textarea
                        v-model="formArtwork.description_fr"
                        :placeholder="$t('form-artworks.description-fr')"
                    ></textarea>
                    <textarea
                        v-model="formArtwork.description_en"
                        :placeholder="$t('form-artworks.description-en')"
                    ></textarea>
                    <!--
                    <input type="file" multiple @change="handleFileUpload" />
                    -->
                    <ButtonComponent type="submit" class="submit-button">
                        {{ t('button.update') }}
                    </ButtonComponent>
                </form>
            </div>
            <ErrorComponent v-if="error" :error="error" />
        </section>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArtworksStore } from '@/stores/artworksStore';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const artworkStore = useArtworksStore();
const { locale } = useLanguage();

const formArtwork = reactive({
    title_fr: '',
    title_en: '',
    techniques_fr: '',
    techniques_en: '',
    dimensions: '',
    description_fr: '',
    description_en: '',
    //files: [], TODO later
    artwork_id: '',
    price: null,
    stock: null,
});
const error = computed(() => artworkStore.error);
const artwork = computed(() => artworkStore.selectedArtwork);

const artworkId = route.params.id;
const category = route.params.category;

const submitForm = async () => {
    const payload = { ...formArtwork, type: category };
    await artworkStore.updateArtwork(artworkId, payload);
    if (!artworkStore.error) {
        router.push(`/gallery/${category}`);
    }
};

onMounted(async () => {
    artworkStore.resetErrorSuccess();
    await artworkStore.fetchArtworkById(artworkId);
    if (artwork.value) {
        formArtwork.title_fr = artwork.value.title.fr;
        formArtwork.title_en = artwork.value.title.en;
        formArtwork.techniques_fr = artwork.value.techniques.fr;
        formArtwork.techniques_en = artwork.value.techniques.en;
        formArtwork.dimensions = artwork.value.dimensions;
        formArtwork.description_fr = artwork.value.description.fr;
        formArtwork.description_en = artwork.value.description.en;
    }
});
</script>
