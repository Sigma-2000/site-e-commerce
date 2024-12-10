import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/gallery',
            name: 'gallery',
            component: () => import('../views/gallery/GalleryView.vue'),
        },
        {
            path: '/gallery/:category',
            name: 'gallery-category',
            component: () => import('../views/gallery/GalleryCategoryView.vue'),
        },
        {
            path: '/gallery/:category/:id',
            name: 'artwork-details',
            component: () => import('../views/gallery/ArtworkDetailsView.vue'),
        },
        {
            path: '/shop',
            name: 'shop',
            component: () => import('../views/shop/ShopView.vue'),
        },
        {
            path: '/shop/:category',
            name: 'shop-category',
            component: () => import('../views/shop/ShopCategoryView.vue'),
        },
        {
            path: '/shop/:category/:id',
            name: 'product-details',
            component: () => import('../views/shop/ProductDetailsView.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue'),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

export default router;
