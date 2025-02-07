<template>
    <div class="about">
        <div class="logo-underline-short"></div>
        <h2>{{ $t('menu.about') }}</h2>
        <div class="logo-underline-long"></div>
        <div class="about-photo">
            <img src="/images/sigma-2000-photo.jpg" alt="portrait of the artist" />
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
                <li>
                    <i18n-t keypath="exhibitions.group-vacarmes" tag="span"
                        ><template #group>
                            <span>
                                <strong>{{ $t('exhibitions.group') }}</strong></span
                            >
                        </template>
                        <template #vacarmes>
                            <span>
                                <em>{{ $t('exhibitions.vacarmes') }}</em></span
                            > </template
                        ><template #rita>
                            <span>
                                <strong>{{ $t('exhibitions.rita') }}</strong></span
                            >
                        </template></i18n-t
                    >
                </li>
                <li>
                    <i18n-t keypath="exhibitions.auction-sale" tag="span"
                        ><template #auction>
                            <span>
                                <strong>{{ $t('exhibitions.auction') }}</strong></span
                            >
                        </template>
                        <template #graffart>
                            <span>
                                <strong>{{ $t('exhibitions.graffart') }}</strong></span
                            >
                        </template>
                        <template #continent>
                            <span>
                                <em>{{ $t('exhibitions.continent') }}</em></span
                            >
                        </template>
                    </i18n-t>
                </li>
                <li>
                    <i18n-t keypath="exhibitions.group-7th-continent" tag="span"
                        ><template #group>
                            <span>
                                <strong>{{ $t('exhibitions.group') }}</strong></span
                            >
                        </template>
                        <template #continent>
                            <span>
                                <em>{{ $t('exhibitions.continent') }}</em></span
                            >
                        </template>
                        <template #gallery>
                            <span>
                                <strong>{{ $t('exhibitions.gallery') }}</strong></span
                            >
                        </template>
                    </i18n-t>
                </li>
                <li>
                    <i18n-t keypath="exhibitions.sale-bloc-13" tag="span"
                        ><template #sale>
                            <span>
                                <strong>{{ $t('exhibitions.sale') }}</strong></span
                            >
                        </template>
                        <template #market>
                            <span>
                                <strong>{{ $t('exhibitions.market') }}</strong></span
                            >
                        </template>
                    </i18n-t>
                </li>
                <li>
                    <i18n-t keypath="exhibitions.solo-green-tide" tag="span"
                        ><template #solo>
                            <span>
                                <strong>{{ $t('exhibitions.solo') }}</strong></span
                            >
                        </template>
                        <template #tides>
                            <span>
                                <em>{{ $t('exhibitions.tides') }}</em></span
                            >
                        </template>
                        <template #igem>
                            <span>
                                <strong>{{ $t('exhibitions.igem') }}</strong></span
                            >
                        </template>
                        <template #university>
                            <span>
                                <strong>{{ $t('exhibitions.university') }}</strong></span
                            >
                        </template>
                    </i18n-t>
                </li>
                <li>
                    <i18n-t keypath="exhibitions.group-igem" tag="span"
                        ><template #group>
                            <span>
                                <strong>{{ $t('exhibitions.group') }}</strong></span
                            >
                        </template>
                        <template #igem>
                            <span>
                                <strong>{{ $t('exhibitions.igem') }}</strong></span
                            >
                        </template>
                        <template #maison>
                            <span>
                                <strong>{{ $t('exhibitions.maison') }}</strong></span
                            >
                        </template>
                    </i18n-t>
                </li>
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
