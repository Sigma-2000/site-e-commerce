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
                <ul v-if="artworksPaginatedList.length && !isLoading">
                    <li
                        v-for="artwork in artworksPaginatedList"
                        :key="artwork._id"
                        class="category-items"
                    >
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
                            <div v-if="isAdmin" class="admin-actions">
                                <button @click="removeArtwork(artwork._id)">
                                    <Icon
                                        icon="material-symbols-light:close"
                                        width="36"
                                        height="36"
                                    />
                                </button>
                                <router-link
                                    :to="`/gallery/${category}/edit/${artwork._id}`"
                                    class="edit-link"
                                >
                                    <Icon
                                        icon="fluent-mdl2:field-not-changed"
                                        width="26"
                                        height="26"
                                    />
                                </router-link>
                                <router-link
                                    :to="`/gallery/${category}/add-product/${artwork.id}`"
                                    class="edit-link"
                                    ><Icon icon="fluent:add-20-regular" width="32" height="32"
                                /></router-link>
                            </div>
                        </div>
                        <div class="underline-center"></div>
                    </li>
                </ul>
                <div class="category-content-items-more-results-button">
                    <ButtonComponent v-if="hasMoreResults" @click="loadMoreResults">
                        {{ $t('button.more-results') }}
                    </ButtonComponent>
                </div>
            </section>
        </div>
        <LoaderComponent v-if="isLoading" />
        <ErrorComponent v-if="error" :error="error" />
        <SuccessComponent v-if="success" :success="success" />
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { Icon } from '@iconify/vue';
import { useArtworksStore } from '@/stores/artworksStore';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useUsersStore } from '@/stores/usersStore';

const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const artworkStore = useArtworksStore();
const userStore = useUsersStore();

const category = computed(() => route.params.category);
const artworksPaginatedList = computed(() => artworkStore.artworksPaginatedList);
const isLoading = computed(() => artworkStore.isLoading);
const error = computed(() => artworkStore.error);
const success = computed(() => artworkStore.success);
const isAdmin = computed(() => userStore.userInformation?.role === 'admin');

const removeArtwork = async (id) => {
    await artworkStore.deleteArtwork(id);
    await artworkStore.fetchArtworks(category.value);
};

const hasMoreResults = computed(() => {
    const totalFiltered = artworkStore.filteredArtworks(category.value).length;
    return artworksPaginatedList.value.length < totalFiltered;
});

const loadMoreResults = () => {
    artworkStore.loadMore(category.value);
};

onMounted(async () => {
    artworkStore.resetPagination();
    await artworkStore.fetchArtworks(category.value);
    artworkStore.resetErrorSuccess();
});
</script>
