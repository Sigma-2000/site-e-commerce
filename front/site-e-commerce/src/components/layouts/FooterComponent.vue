<template>
    <div class="content-footer">
        <span>EN</span><span>/</span><span>FR</span>
        <div class="content-footer-mode">
            <Icon icon="iconamoon:mode-light-thin" width="24" class="content-footer-mode-icon" />
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
/* choose lang: <div class="menu-item">
    get Addin example in:
  <SwitchLocale :layout="textLayout" />
        </div>
        const textLayout = LocaleLayouts.TEXT;
        const { locale } = useI18n();
        set this in utils :
        export const LocaleLayouts = {
    FLUENT_SELECT: 'Fluent Select',
    TEXT: 'Text',
};
        */
</script>
