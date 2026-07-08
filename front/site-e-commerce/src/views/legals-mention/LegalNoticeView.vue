<template>
    <div class="cart-view">
        <div class="underline-short"></div>
        <router-link to="/" class="pages-link">
            <h2>Sigma.2000</h2>
        </router-link>
        <div class="underline-long"></div>

        <h3>{{ $t('legal.notice') }}</h3>

        <section class="legal-section">
            <h4>{{ $t('legal.publisher') }}</h4>
            <p>{{ $t('legal.publisherText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.businessInfo') }}</h4>
            <p>{{ $t('legal.businessInfoText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.hosting') }}</h4>
            <p>{{ $t('legal.hostingText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.intellectualProperty') }}</h4>
            <p>{{ $t('legal.intellectualPropertyText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.contact') }}</h4>
            <p>{{ $t('legal.contactText') }} amelieguyot7@gmail.com</p>
        </section>
    </div>
</template>

<script setup></script>
