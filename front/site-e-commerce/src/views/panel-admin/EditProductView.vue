<template>
    <div class="edit-view">
        <div class="underline-short"></div>
        <router-link to="/shop" class="pages-link">
            <h2>{{ $t('menu.shop') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="edit-submenu">
            <router-link :to="`/shop/${category}`" class="pages-link">
                <h3>{{ t(`shop-categories.${category}`) }}</h3>
            </router-link>
            <div class="underline-extra-short"></div>
        </div>
        <section class="edit-card">
            <h2>{{ t('form-product.update') }}</h2>
            <div v-if="product.artwork_id">
                <h3>{{ product.artwork_id.title[locale] }}</h3>
                <div class="edit-image">
                    <img
                        v-if="product.artwork_id.images && product.artwork_id.images.length"
                        :src="product.artwork_id.images[4]"
                        :alt="product.artwork_id.title[locale]"
                    />
                </div>
            </div>
            <SuccessComponent v-if="success" :success="success" />
            <ErrorComponent v-if="error" :error="error" />
            <div class="edit-card-text">
                <form @submit.prevent="submitForm" class="edit-form">
                    <label for="price"
                        ><strong>{{ $t('form-product.actual-price') }}: </strong
                        >{{ product.price }} €</label
                    >
                    <input id="price" type="text" v-model="FormProduct.price" required />
                    <label for="stock">
                        <strong>{{ $t('form-product.actual-stock') }}: </strong>{{ product.stock }}
                    </label>
                    <input id="stock" type="text" v-model="FormProduct.stock" required />
                    <ButtonComponent type="submit" class="submit-button">
                        {{ t('button.update') }}
                    </ButtonComponent>
                </form>
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';

const { t } = useI18n();
const route = useRoute();
const productStore = useProductsStore();
const { locale } = useLanguage();

const FormProduct = reactive({
    price: 0,
    stock: 0,
});
const error = computed(() => productStore.error);
const success = computed(() => productStore.success);
const product = computed(() => productStore.selectedProduct);
const productId = route.params.id;
const category = route.params.category;

const submitForm = async () => {
    const form = { ...FormProduct, category };
    await productStore.updateProduct(productId, form);
    await productStore.fetchProductById(productId);
};

onMounted(async () => {
    productStore.resetErrorSuccess();
    await productStore.fetchProductById(productId);
});
</script>
