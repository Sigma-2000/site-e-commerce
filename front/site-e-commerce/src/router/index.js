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
            component: () => import('../views/GalleryView.vue'),
        },
        {
            path: '/gallery/:category',
            name: 'gallery-category',
            component: () => import('../views/GalleryCategoryView.vue'),
        },
        {
            path: '/shop',
            name: 'shop',
            component: () => import('../views/ShopView.vue'),
        },
        {
            path: '/shop/:category',
            name: 'shop-category',
            component: () => import('../views/ShopCategoryView.vue'),
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
