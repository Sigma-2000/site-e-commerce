<template>
    <div v-if="error" class="error">
        {{ t(error) }}
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    error: {
        type: String,
        required: false,
    },
});

const { t } = useI18n();
</script>

<style>
.error {
    color: var(--error-color);
    margin: 20px 0;
}
</style>
