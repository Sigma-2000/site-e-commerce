<template>
    <div class="about">
        <div class="logo-underline-short"></div>
        <h2>{{ $t('menu.about') }}</h2>
        <div class="logo-underline-long"></div>
        <div class="about-photo">
            <img src="/images/sigma-2000-photo.jpg" alt="framing-original" />
        </div>
        <div class="about-text">
            <p>{{ $t('homepage.presentation') }}</p>
            <p>{{ $t('about.pratices') }}</p>
            <p>{{ $t('about.abstraction') }}</p>
            <p>{{ $t('about.conclusion') }}</p>
        </div>
        <div class="link-media">
            <a href="https://www.instagram.com/sigma.2000/" target="_blank" aria-label="Instagram">
                <Icon icon="skill-icons:instagram"
            /></a>
            <a href="amelieguyot7@gmail.com" aria-label="Email">
                <Icon icon="iconamoon:email-light" style="color: var(--color-text)" />
            </a>
            <a href="https://www.facebook.com/sigma.2000.art" target="_blank" aria-label="Facebook">
                <Icon icon="devicon:facebook" />
            </a>
        </div>
        <div class="logo-underline-short"></div>
        <h2>{{ $t('about.exhibition') }}</h2>
        <div class="logo-underline-long"></div>
        <div class="exhibitions-career">
            <h3>{{ $t('exhibitions-sales') }}</h3>
            <ul>
                <li v-html="$t('exhibitions.vacarmes')"></li>
                <li v-html="$t('exhibitions.auction-sale')"></li>
                <li v-html="$t('exhibitions.7th-continent')"></li>
                <li v-html="$t('exhibitions.bloc-13')"></li>
                <li v-html="$t('exhibitions.green-tide')"></li>
                <li v-html="$t('exhibitions.igem')"></li>
            </ul>
            <h3>{{ $t('career.presentation') }}</h3>
            <p>{{ $t('career.intro') }}</p>
            <p>{{ $t('career.beginning') }}</p>
            <p>{{ $t('career.digital-art') }}</p>
            <p>{{ $t('career.conclusion') }}</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>
<style></style>
