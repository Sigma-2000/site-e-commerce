<template>
    <div class="cart-view">
        <div class="underline-short"></div>
        <router-link to="/shop" class="pages-link">
            <h2>{{ $t('menu.shop') }}</h2>
        </router-link>
        <div class="underline-long"></div>

        <h3>{{ $t('legal.terms') }}</h3>

        <section class="legal-section">
            <h4>{{ $t('legal.termsScope') }}</h4>
            <p>{{ $t('legal.termsScopeText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.products') }}</h4>
            <p>{{ $t('legal.productsText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.prices') }}</h4>
            <p>{{ $t('legal.pricesText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.orderProcess') }}</h4>
            <p>{{ $t('legal.orderProcessText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.payment') }}</h4>
            <p>{{ $t('legal.paymentText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.shipping') }}</h4>
            <p>{{ $t('legal.shippingText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.returns') }}</h4>
            <p>{{ $t('legal.returnsText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.withdrawal') }}</h4>
            <p>{{ $t('legal.withdrawalText') }}</p>
        </section>

        <section class="legal-section">
            <h4>{{ $t('legal.law') }}</h4>
            <p>{{ $t('legal.lawText') }}</p>
        </section>
    </div>
</template>

<script setup></script>
