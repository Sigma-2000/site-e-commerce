<template>
    <div class="cart-view">
        <div class="underline-short"></div>
        <router-link to="/" class="pages-link">
            <h2>Sigma.2000</h2>
        </router-link>
        <div class="underline-long"></div>

        <h3>{{ $t('legal.privacy') }}</h3>
        <section class="legal-section">
            <p class="legal-date">{{ $t('legal.privacyUpdated') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyCollection') }}</h4>
            <p>{{ $t('legal.privacyCollectionText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyUse') }}</h4>
            <p>{{ $t('legal.privacyUseText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyPayment') }}</h4>
            <p>{{ $t('legal.privacyPaymentText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacySharing') }}</h4>
            <p>{{ $t('legal.privacySharingText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacySecurity') }}</h4>
            <p>{{ $t('legal.privacySecurityText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyRetention') }}</h4>
            <p>{{ $t('legal.privacyRetentionText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyRights') }}</h4>
            <p>{{ $t('legal.privacyRightsText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.privacyConsent') }}</h4>
            <p>{{ $t('legal.privacyConsentText') }}</p>
        </section>
    </div>
</template>

<script setup></script>
