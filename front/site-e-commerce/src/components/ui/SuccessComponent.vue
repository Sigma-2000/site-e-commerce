<template>
    <div v-if="success" class="success">
        {{ t(success) }}
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    success: {
        type: String,
        required: false,
    },
});

const { t } = useI18n();
</script>

<style>
.success {
    color: var(--success-color);
    margin: 20px 0;
}
</style>
