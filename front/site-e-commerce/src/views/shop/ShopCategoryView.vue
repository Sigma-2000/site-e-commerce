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
                <ul v-if="productsPaginatedList.length && !isLoadingFromAPi">
                    <li
                        v-for="product in productsPaginatedList"
                        :key="product._id"
                        class="category-items"
                    >
                        <SuccessComponent
                            v-if="successAddedCart && lastAddedProductId === product._id"
                            :success="successAddedCart"
                        />
                        <h2>{{ product.artwork_id.title[locale] }}</h2>
                        <div class="category-content-items">
                            <img
                                v-if="product.artwork_id.images && product.artwork_id.images.length"
                                :src="product.artwork_id.images[4]"
                                :alt="product.artwork_id.title[locale]"
                                loading="lazy"
                            />
                            <div class="category-content-items-more-details">
                                <p>
                                    <strong>
                                        {{ $t('detail.price') }}: {{ product.price }} €</strong
                                    >
                                </p>
                                <div
                                    v-if="!isAdmin"
                                    class="category-content-items-more-details-button"
                                >
                                    <ButtonComponent
                                        @click="addProductToCart(product)"
                                        :disabled="product.stock === 0"
                                        class="custom-button"
                                    >
                                        {{
                                            product.stock === 0
                                                ? $t('button.out-of-stock')
                                                : $t('button.buy')
                                        }}</ButtonComponent
                                    >
                                </div>
                                <p v-if="isAdmin">
                                    <strong>
                                        {{ $t('form-product.stock') }}: {{ product.stock }}
                                    </strong>
                                </p>
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
                            <div v-if="isAdmin" class="admin-actions">
                                <button @click="removeProduct(product._id)">
                                    <Icon
                                        icon="material-symbols-light:close"
                                        width="36"
                                        height="36"
                                    />
                                </button>
                                <router-link
                                    :to="`/shop/${category}/edit/${product._id}`"
                                    class="edit-link"
                                >
                                    <Icon
                                        icon="fluent-mdl2:field-not-changed"
                                        width="26"
                                        height="26"
                                    />
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
            <LoaderComponent v-if="isLoadingFromAPi" />
            <ErrorComponent v-if="error" :error="error" />
            <SuccessComponent v-if="success" :success="success" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useLanguage } from '@/composables/useLanguage';
import { useUsersStore } from '@/stores/usersStore';
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();
const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const productStore = useProductsStore();
const userStore = useUsersStore();

const lastAddedProductId = ref(null);

const isAdmin = computed(() => userStore.userInformation?.role === 'admin');
const category = computed(() => route.params.category);
const productsPaginatedList = computed(() => productStore.productsPaginatedList);

const isLoadingFromAPi = computed(() => productStore.isLoading);
const error = computed(() => productStore.error);
const success = computed(() => productStore.success);
const successAddedCart = computed(() => cartStore.success);

const hasMoreProductsResults = computed(() => {
    const totalFiltered = productStore.filteredProducts(category.value).length;
    return productsPaginatedList.value.length < totalFiltered;
});

const loadMoreProductsResults = () => {
    productStore.loadMoreProducts(category.value);
};

const removeProduct = async (id) => {
    await productStore.deleteProduct(id);
    await productStore.fetchProducts(category.value);
};

const addProductToCart = (product) => {
    if (product && product.stock > 0) {
        product.stock -= 1;
        console.log(product._id);

        const productAddedToCart = {
            id: product._id,
            title: product.artwork_id.title,
            price: product.price,
            image: product.artwork_id.images?.[4],
            stock: product.stock,
            type: category,
        };
        console.log(productAddedToCart);
        cartStore.addToCart(productAddedToCart);
        lastAddedProductId.value = product._id;
    }
};
watch(
    () => cartStore.success,
    (newValue) => {
        if (newValue) {
            setTimeout(() => {
                cartStore.resetErrorSuccess();
                lastAddedProductId.value = null;
            }, 3000);
        }
    }
);

onMounted(async () => {
    productStore.resetPagination(); //maybe no need because it's fetching the data at mounting and the store display pagination
    productStore.resetErrorSuccess();
    cartStore.resetErrorSuccess();
    await productStore.fetchProducts(category.value);
});
</script>
