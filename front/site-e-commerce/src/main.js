import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';
import fr from './fr.json';
import en from './en.json';
import './scss/main.scss';

import { useUsersStore } from '@/stores/usersStore.js';

const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
        en,
        fr,
    },
});

const app = createApp(App);

app.use(createPinia());

const usersStore = useUsersStore();

// Restore the session without blocking public navigation.
void usersStore.fetchUser().catch((error) => {
    console.error('Initial session restoration failed:', error);
});

app.use(router);
app.use(i18n);

app.mount('#app');

export default i18n;
