<template>
    <div class="content-footer">
        <div class="footer-language">
            <span :class="{ selected: locale === 'en' }" @click.prevent="changeLanguage('en')"
                >EN</span
            ><span>/</span
            ><span :class="{ selected: locale === 'fr' }" @click.prevent="changeLanguage('fr')"
                >FR</span
            >
        </div>
        <div class="footer-legal-links">
            <router-link to="/legal-notice">{{ $t('legal.notice') }}</router-link>
            <router-link to="/terms">{{ $t('legal.terms') }}</router-link>
            <router-link to="/privacy">{{ $t('legal.privacy') }}</router-link>
        </div>
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
