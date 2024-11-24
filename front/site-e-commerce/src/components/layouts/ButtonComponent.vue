<template>
    <button :disabled="disabled" class="custom-button" @click="onClick">
        <slot />
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    label: {
        type: String,
        default: 'Button',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['click']);

function onClick() {
    if (!props.disabled) {
        emit('click');
    }
}
</script>
