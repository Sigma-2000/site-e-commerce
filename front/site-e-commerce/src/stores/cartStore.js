import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
        totalPrice: 0,
        success: null,
        error: null,
    }),
    actions: {
        async addToCart(product) {
            this.success = null;
            try {
                const alreadyProducts = this.cart.find((item) => item.id === product.id);
                if (alreadyProducts) {
                    alreadyProducts.quantity++;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }
                await axiosCaller.post(`/product/${product.id}/reservation`, {
                    quantity: 1,
                });
                this.success = 'success.add-product-cart';
                this.persistCart();
            } catch (err) {
                this.error = 'error.add-product-cart';
                console.error(err);
            }
        },
        async removeFromCart(productId) {
            try {
                const productInCart = this.cart.find((item) => item.id === productId);
                if (!productInCart) return;

                await axiosCaller.post(`/product/${productId}/remove-reservation`, {
                    quantity: productInCart.quantity,
                });

                this.cart = this.cart.filter((item) => item.id !== productId);
                this.success = 'success.remove-product-cart';
                await this.validateCart();
                this.syncCartWithLocalStorage();
            } catch (err) {
                this.error = 'errors.remove-product-cart';
                console.error(err);
            }
        },
        persistCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        async validateCart() {
            this.error = null;
            this.success = null;
            try {
                const response = await axiosCaller.post('/order/validate-cart', {
                    cart: this.cart,
                });
                const updatedCart = response.data.updatedCart;
                console.log(updatedCart);
                this.cart = updatedCart.filter((item) => item.message.includes('valid'));
                const hasRemovedItems = updatedCart.some((item) =>
                    item.message.includes('removed')
                );
                const hasAdjustedItems = updatedCart.some((item) =>
                    item.message.includes('adjusted')
                );

                this.totalPrice = response.data.total_price;
                localStorage.setItem('cart', JSON.stringify(this.cart));

                if (hasRemovedItems) {
                    this.error = 'errors.cart-product-removed';
                } else if (hasAdjustedItems) {
                    this.success = 'success.cart-updated';
                } else {
                    this.success = null;
                    this.error = null;
                }
            } catch (err) {
                this.error = 'errors.cart-validation';
                console.error(err);
            }
        },
        async loadCart() {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                this.cart = JSON.parse(storedCart);
            }
            await this.validateCart();
        },
        syncCartWithLocalStorage() {
            if (this.cart.length > 0) {
                localStorage.setItem('cart', JSON.stringify(this.cart));
            } else {
                localStorage.removeItem('cart');
            }
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
