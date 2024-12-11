<template>
    <div class="category-view">
        <div class="underline-short"></div>
        <router-link to="/shop" class="pages-link">
            <h2>{{ $t('menu.shop') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="category-content">
            <h3>{{ t(`shop-categories.${category}`) }}</h3>
            <div class="underline-extra-short"></div>
            <section class="category-content-list">
                <ul v-if="productsPaginatedList.length && !isLoading">
                    <li
                        v-for="product in productsPaginatedList"
                        :key="product._id"
                        class="category-items"
                    >
                        <h2>{{ product.artwork_id.title[locale] }}</h2>
                        <div class="category-content-items">
                            <img
                                v-if="product.artwork_id.images && product.artwork_id.images.length"
                                :src="product.artwork_id.images[4]"
                                :alt="product.artwork_id.title[locale]"
                            />
                            <div class="category-content-items-more-details">
                                <p>
                                    <strong>
                                        {{ $t('detail.price') }}: {{ product.price }} €</strong
                                    >
                                </p>
                                <div class="category-content-items-more-details-button">
                                    <ButtonComponent
                                        class="custom-button"
                                        :disabled="product.stock === 0"
                                        >{{ $t('button.buy') }}</ButtonComponent
                                    >
                                </div>
                                <p>
                                    {{ product.artwork_id.techniques[locale] }}
                                </p>
                                <router-link
                                    :to="`/shop/${category}/${product._id}`"
                                    class="details-link"
                                >
                                    {{ $t('display.details') }}
                                </router-link>
                            </div>
                        </div>
                        <div class="underline-center"></div>
                    </li>
                </ul>
                <div class="category-content-items-more-results-button">
                    <ButtonComponent v-if="hasMoreProductsResults" @click="loadMoreProductsResults">
                        {{ $t('button.more-results') }}
                    </ButtonComponent>
                </div>
            </section>
            <LoaderComponent v-if="isLoading" />
            <ErrorComponent v-if="error" :error="error" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useI18n } from 'vue-i18n';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const productStore = useProductsStore();

const category = computed(() => route.params.category);
const productsPaginatedList = computed(() => productStore.productsPaginatedList);
const isLoading = computed(() => productStore.isLoading);
const error = computed(() => productStore.error);

const hasMoreProductsResults = computed(() => {
    const totalFiltered = productStore.filteredProducts(category.value).length;
    return productsPaginatedList.value.length < totalFiltered;
});

const loadMoreProductsResults = () => {
    productStore.loadMoreProducts(category.value);
};
//TODO: verification for stock reactivity, maybe in store ??
onMounted(async () => {
    productStore.resetPagination();

    await productStore.fetchProducts(category.value);
});
</script>
