<template>
    <div class="modificate-views">
        <h3 v-if="isAddingArtwork">
            <Icon
                icon="material-symbols-light:arrow-back"
                @click="toggleAddArtwork"
                class="go-back-icon"
                width="24"
                height="24"
            />
        </h3>
        <div v-if="!isAddingArtwork" class="cart-modificate">
            <div class="add">
                <i18n-t keypath="panel-admin.add-artwork" tag="div" class="modificate-action"
                    ><template #add>
                        <span @click="toggleAddArtwork" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.add') }}</strong></span
                        >
                    </template>
                </i18n-t>
                <i18n-t keypath="panel-admin.add-product" tag="div" class="modificate-action"
                    ><template #add>
                        <span @click="navigateToGallery" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.add') }}</strong></span
                        >
                    </template>
                </i18n-t>
            </div>
            <div class="modificate">
                <i18n-t keypath="panel-admin.modificate-artwork" tag="div" class="modificate-action"
                    ><template #modificate>
                        <span @click="navigateToGallery" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.modificate') }}</strong></span
                        >
                    </template>
                </i18n-t>
                <i18n-t
                    keypath="panel-admin.modificate-product"
                    tag="div"
                    class="modificate-action"
                >
                    <template #modificate>
                        <span @click="navigateToShop" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.modificate') }}</strong></span
                        >
                    </template>
                </i18n-t>
            </div>
            <div class="delete">
                <i18n-t keypath="panel-admin.delete-artwork" tag="div" class="modificate-action">
                    <template #delete>
                        <span @click="navigateToGallery" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.delete') }}</strong></span
                        >
                    </template>
                </i18n-t>
                <i18n-t keypath="panel-admin.delete-product" tag="div" class="modificate-action"
                    ><template #delete>
                        <span @click="navigateToShop" class="modificate-action-click">
                            <strong>{{ $t('panel-admin.delete') }}</strong></span
                        >
                    </template>
                </i18n-t>
            </div>
        </div>
        <form v-else @submit.prevent="handleSubmit" class="modificate-form">
            <p>{{ $t('panel-admin.upload') }}</p>
            <i18n-t
                keypath="panel-admin.add-artwork"
                tag="div"
                @click="toggleAddArtwork"
                class="modificate-action"
                ><template #add>
                    <span>
                        <strong>{{ $t('panel-admin.add') }}</strong></span
                    >
                </template>
            </i18n-t>
            <input
                v-model="form.title_fr"
                type="text"
                :placeholder="$t('form-artworks.title-fr')"
                required
            />
            <input
                v-model="form.title_en"
                type="text"
                :placeholder="$t('form-artworks.title-en')"
                required
            />
            <select v-model="form.type" :placeholder="$t('form-artworks.type')" required>
                <option disabled value="">{{ $t('form-artworks.type') }}</option>
                <option value="painting">{{ $t('categories.painting') }}</option>
                <option value="digital art">{{ $t('categories.digital-art') }}</option>
                <option value="photography">{{ $t('categories.photography') }}</option>
                <option value="graffiti">{{ $t('categories.graffiti') }}</option>
            </select>
            <input
                v-model="form.techniques_fr"
                type="text"
                :placeholder="$t('form-artworks.techniques-fr')"
            />
            <input
                v-model="form.techniques_en"
                type="text"
                :placeholder="$t('form-artworks.techniques-en')"
            />
            <input
                v-model="form.dimensions"
                type="text"
                :placeholder="$t('form-artworks.dimensions')"
            />
            <textarea
                v-model="form.description_fr"
                :placeholder="$t('form-artworks.description-fr')"
            ></textarea>
            <textarea
                v-model="form.description_en"
                :placeholder="$t('form-artworks.description-en')"
            ></textarea>
            <input type="file" multiple @change="handleFileUpload" />
            <ButtonComponent type="submit" class="add-artworks-button">{{
                $t('button.add-artworks')
            }}</ButtonComponent>
        </form>
        <ErrorComponent v-if="error" :error="error" />
        <SuccessComponent v-if="success" :success="success" />
        <LoaderComponent v-if="isLoading" />
    </div>
</template>
<script setup>
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import LoaderComponent from '../ui/LoaderComponent.vue';

import { Icon } from '@iconify/vue';
import { useArtworksStore } from '@/stores/artworksStore';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const artworksStore = useArtworksStore();
const router = useRouter();

const isAddingArtwork = ref(false);
const success = computed(() => artworksStore.success);
const error = computed(() => artworksStore.error);
const isLoading = computed(() => artworksStore.isLoading);

const toggleAddArtwork = () => {
    isAddingArtwork.value = !isAddingArtwork.value;
};

const form = reactive({
    title_fr: '',
    title_en: '',
    type: '',
    techniques_fr: '',
    techniques_en: '',
    dimensions: '',
    description_fr: '',
    description_en: '',
    files: [],
    artwork_id: '',
    price: null,
    stock: null,
});

const handleSubmit = async () => {
    await artworksStore.addArtwork(form);
    if (!artworksStore.error) {
        isAddingArtwork.value = false;
    }
};
const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    form.files = [...form.files, ...newFiles];
};
const navigateToGallery = () => {
    router.push('/gallery');
};
const navigateToShop = () => {
    router.push('/shop');
};

onMounted(() => {
    artworksStore.resetErrorSuccess();
});
</script>
