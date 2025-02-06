<template>
    <div class="item-details">
        <div class="underline-short"></div>
        <router-link to="/shop" class="pages-link">
            <h2>{{ $t('menu.shop') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="item-details-submenu">
            <router-link :to="`/shop/${category}`" class="pages-link">
                <h3>{{ t(`shop-categories.${category}`) }}</h3>
            </router-link>
            <div class="underline-extra-short"></div>
            <section v-if="product.artwork_id" class="item-details-card">
                <h2>{{ product.artwork_id.title[locale] }}</h2>
                <div class="detail-card-main-image">
                    <img
                        v-if="product.artwork_id.images && product.artwork_id.images.length"
                        :src="product.artwork_id.images[4]"
                        :alt="product.artwork_id.title[locale]"
                        loading="lazy"
                    />
                </div>
                <SuccessComponent v-if="successAddedCart" :success="successAddedCart" />
                <ErrorComponent v-if="error" :error="error" />
                <div class="item-details-card-button">
                    <ButtonComponent
                        :disabled="product.stock === 0"
                        @click="addProductToCart(product)"
                        class="custom-button"
                    >
                        {{
                            product.stock === 0 ? $t('button.out-of-stock') : $t('button.buy')
                        }}</ButtonComponent
                    >
                </div>
                <div class="item-details-card-text">
                    <p>
                        <strong>{{ $t('detail.price') }}: </strong>{{ product.price }} €
                    </p>
                    <div class="item-details-card-text-additional">
                        <p>
                            <strong>{{ $t('detail.dimensions') }}: </strong
                            >{{ product.artwork_id.dimensions }}
                        </p>
                        <p>
                            <strong>{{ $t('detail.description') }}: </strong
                            >{{ product.artwork_id.description[locale] }}
                        </p>
                    </div>
                </div>
                <div
                    class="detail-card-images"
                    v-if="product.artwork_id.images && product.artwork_id.images.length > 1"
                >
                    <img
                        v-for="(image, index) in product.artwork_id.images.slice(0, -1)"
                        :key="index"
                        :src="image"
                        :alt="`${product.artwork_id} - ${index}`"
                        loading="lazy"
                        class="detail-image"
                    />
                </div>
            </section>
            <LoaderComponent v-else />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { useProductsStore } from '@/stores/productsStore';
import { useCartStore } from '@/stores/cartStore';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';

const productStore = useProductsStore();

const { t } = useI18n();
const { locale } = useLanguage();
const route = useRoute();
const cartStore = useCartStore();

const category = route.params.category;
const productId = route.params.id;

const product = computed(() => productStore.selectedProduct);
const error = computed(() => productStore.error);
const successAddedCart = computed(() => cartStore.success);

const addProductToCart = (product) => {
    if (product && product.stock > 0) {
        product.stock -= 1;
        const productAddedToCart = {
            id: product._id,
            title: product.artwork_id.title, // inside we have en and fr
            price: product.price,
            image: product.artwork_id.images?.[4],
            stock: product.stock,
            type: category,
        };
        console.log(productAddedToCart);
        cartStore.addToCart(productAddedToCart);
    }
};

watch(
    () => cartStore.success,
    (newValue) => {
        if (newValue) {
            setTimeout(() => {
                cartStore.resetErrorSuccess();
            }, 3000);
        }
    }
);

onMounted(async () => {
    productStore.resetErrorSuccess();
    cartStore.resetErrorSuccess();
    await productStore.fetchProductById(productId);
});
</script>
