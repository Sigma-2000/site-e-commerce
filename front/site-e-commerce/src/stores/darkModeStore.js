import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDarkModeStore = defineStore('darkMode', () => {
    const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

    const applyTheme = () => {
        const theme = isDarkMode.value ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
        applyTheme();
    };

    applyTheme();

    return { isDarkMode, toggleDarkMode };
});
