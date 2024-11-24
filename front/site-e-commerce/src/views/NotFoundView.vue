<template>
    <div class="not-found">
        <h1>{{ t('not-found.404') }}</h1>
        <p>{{ t('not-found.redirection', { seconds: counter }) }}</p>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const router = useRouter();
const { t } = useI18n();
const counter = ref(10);

const countdown = setInterval(() => {
    counter.value -= 1;
    if (counter.value <= 0) {
        clearInterval(countdown);
        router.push('/');
    }
}, 1000);
</script>
