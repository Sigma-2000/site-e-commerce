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
                <h2>{{ product.artwork_id.title }}</h2>
                <div class="detail-card-main-image">
                    <img
                        v-if="product.artwork_id.images && product.artwork_id.images.length"
                        :src="product.artwork_id.images[4]"
                        :alt="product.artwork_id.title"
                    />
                </div>
                <div class="item-details-card-button">
                    <ButtonComponent>{{ $t('button.buy') }}</ButtonComponent>
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
                            >{{ product.artwork_id.description }}
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
                        class="detail-image"
                    />
                </div>
            </section>
            <LoaderComponent v-else />
            <ErrorComponent v-if="error" :error="error" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { axiosCaller } from '@/services/axiosCaller';
import LoaderComponent from '@/components/ui/LoaderComponent.vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const product = ref({});
const error = ref(null);
const category = route.params.category;

const fetchDetailsProduct = async () => {
    const id = route.params.id;
    try {
        const response = await axiosCaller.get(`/products/${id}`);
        console.log(response.data);
        product.value = response.data;
    } catch (err) {
        console.error(err);
        error.value = 'errors.display-element';
    }
};

onMounted(async () => {
    fetchDetailsProduct();
});
</script>
