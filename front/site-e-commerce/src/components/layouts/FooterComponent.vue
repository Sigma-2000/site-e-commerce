<template>
    <div class="content-footer">
        <span :class="{ selected: locale === 'en' }" @click.prevent="changeLanguage('en')">EN</span
        ><span>/</span
        ><span :class="{ selected: locale === 'fr' }" @click.prevent="changeLanguage('fr')"
            >FR</span
        >
        <div class="content-footer-mode" @click="toggleDarkMode">
            <Icon
                :icon="
                    darkModeStore.isDarkMode
                        ? 'iconamoon:mode-dark-thin'
                        : 'iconamoon:mode-light-thin'
                "
                width="24"
                class="content-footer-mode-icon"
            />
        </div>
    </div>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage';
import { Icon } from '@iconify/vue';
import { useDarkModeStore } from '@/stores/darkModeStore';

const { locale, changeLanguage } = useLanguage();
const darkModeStore = useDarkModeStore();

const toggleDarkMode = () => {
    darkModeStore.toggleDarkMode();
};
</script>
