import { useI18n } from 'vue-i18n';

export function useLanguage() {
    const { locale } = useI18n();

    const changeLanguage = (lang) => {
        localStorage.setItem('userLang', lang);
        locale.value = lang;
    };

    const savedLang = localStorage.getItem('userLang');
    if (savedLang) {
        locale.value = savedLang;
    }

    return { locale, changeLanguage };
}