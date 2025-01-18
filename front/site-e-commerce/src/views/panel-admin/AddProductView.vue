<template>
    <div class="edit-view">
        <div class="underline-short"></div>
        <router-link to="/gallery" class="pages-link">
            <h2>{{ $t('menu.gallery') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <div class="edit-submenu">
            <router-link :to="`/gallery/${artworkCategory}`" class="pages-link">
                <h3>{{ t(`categories.${artworkCategory}`) }}</h3>
            </router-link>
            <div class="underline-extra-short"></div>
        </div>
        <section class="edit-card">
            <h2>{{ t('panel-admin.adding-product') }}</h2>
            <div v-if="artwork._id">
                <h3>{{ artwork.title[locale] }}</h3>
                <p v-if="artwork.products && artwork.products.length > 0" class="shop-available">
                    <Icon icon="fluent-emoji:framed-picture" />
                    {{ $t('detail.available-shop') }}
                </p>
                <div class="edit-image">
                    <img
                        v-if="artwork.images && artwork.images.length"
                        :src="artwork.images[0]"
                        :alt="artwork.title[locale]"
                    />
                </div>
            </div>
            <ErrorComponent v-if="error" :error="error" />
            <div class="edit-card-text">
                <form @submit.prevent="submitForm" class="edit-form">
                    <select
                        v-model="formProduct.category"
                        :placeholder="$t('form-product.category')"
                        required
                    >
                        <option disabled value="">{{ $t('form-product.category') }}</option>
                        <option value="print">{{ $t('shop-categories.print') }}</option>
                        <option value="original">{{ $t('shop-categories.original') }}</option>
                    </select>
                    <strong
                        ><label for="price">{{ $t('form-product.price') }}</label></strong
                    >
                    <input id="price" type="text" v-model="formProduct.price" required />
                    <strong
                        ><label for="stock"> {{ $t('form-product.stock') }}: </label></strong
                    >
                    <input id="stock" type="text" v-model="formProduct.stock" required />
                    <ButtonComponent type="submit" class="submit-button">
                        {{ t('button.add-product') }}
                    </ButtonComponent>
                </form>
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useArtworksStore } from '@/stores/artworksStore';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const artworkStore = useArtworksStore();
const productStore = useProductsStore();
const { locale } = useLanguage();

const artworkId = route.params.id;
const artworkCategory = route.params.category;

const artwork = computed(() => artworkStore.selectedArtwork);
const error = computed(() => productStore.error);

const formProduct = reactive({
    price: 0,
    stock: 0,
    category: '',
});

const submitForm = async () => {
    await productStore.addProducts(artworkId, formProduct);
    if (!error.value) {
        router.push(`/shop/${formProduct.category}`);
    }
};

onMounted(() => {
    productStore.resetErrorSuccess();
    artworkStore.fetchArtworkById(artworkId);
});
</script>
