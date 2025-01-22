import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useUsersStore } from '@/stores/usersStore.js';

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
        {
            path: '/sign-in',
            name: 'sign-in',
            component: () => import('../views/auth/SignInView.vue'),
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: () => import('../views/auth/SignUpView.vue'),
        },
        {
            path: '/thank-you',
            name: 'thank-you',
            component: () => import('../views/auth/ThankYouView.vue'),
        },
        {
            path: '/account',
            name: 'account',
            component: () => import('../views/AccountView.vue'),
        },
        {
            path: '/panel-admin',
            name: 'panel-admin',
            component: () => import('../views/panel-admin/PanelAdminView.vue'),
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('../views/order/CartView.vue'),
        },
        {
            path: '/shop/:category/edit/:id',
            name: 'edit-product',
            component: () => import('../views/panel-admin/EditProductView.vue'),
        },
        {
            path: '/gallery/:category/edit/:id',
            name: 'edit-artwork',
            component: () => import('../views/panel-admin/EditArtworkView.vue'),
        },
        {
            path: '/gallery/:category/add-product/:id',
            name: 'add-product',
            component: () => import('../views/panel-admin/AddProductView.vue'),
        },
        {
            path: '/panel-admin/orders',
            name: 'orders',
            component: () => import('../views/panel-admin/OrderManagementView.vue'),
        },
    ],

    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

router.beforeEach(async (to, from, next) => {
    const usersStore = useUsersStore();
    try {
        await usersStore.fetchUser();
    } catch (error) {
        console.error(error);
        return next('/sign-in');
    }
    if (to.name === 'account' || to.name === 'panel-admin') {
        if (!usersStore.userInformation) {
            return next('/sign-in');
        }
        if (to.name === 'panel-admin' && usersStore.userInformation.role !== 'admin') {
            return next('/account');
        }
    }

    next();
});

export default router;
