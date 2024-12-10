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
                <ul v-if="filteredProducts.length && !loading">
                    <li
                        v-for="product in filteredProducts"
                        :key="product._id"
                        class="category-items"
                    >
                        <h2>{{ product.artwork_id.title }}</h2>
                        <div class="category-content-items">
                            <img
                                v-if="product.artwork_id.images && product.artwork_id.images.length"
                                :src="product.artwork_id.images[4]"
                                :alt="product.artwork_id.title"
                            />
                            <div class="category-content-items-more-details">
                                <p>
                                    <strong>
                                        {{ $t('detail.price') }}: {{ product.price }} €</strong
                                    >
                                </p>
                                <div class="category-content-items-more-details-button">
                                    <ButtonComponent class="custom-button">{{
                                        $t('button.buy')
                                    }}</ButtonComponent>
                                </div>
                                <p>technique test ui</p>
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
            </section>
            <LoaderComponent v-if="loading" :isLoading="loading" />
            <ErrorComponent v-if="error" :error="error" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { axiosCaller } from '@/services/axiosCaller';
import { useI18n } from 'vue-i18n';

import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

const { t } = useI18n();
const route = useRoute();
const category = route.params.category;
const products = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProducts = async () => {
    try {
        const response = await axiosCaller.get('/products');
        console.log(response.data);
        products.value = response.data;
    } catch (err) {
        error.value = 'errors.display-list';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const filteredProducts = computed(() =>
    products.value.filter((product) => product.category === category)
);

onMounted(() => {
    fetchProducts();
});
</script>
