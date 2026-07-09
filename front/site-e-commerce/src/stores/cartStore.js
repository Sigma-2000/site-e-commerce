import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
        totalPrice: 0,
        success: null,
        error: null,
        cartToken: null,
        shippingMethod: null,
        shippingPrice: 0,
        /**  cartToken: localStorage.getItem("cartToken") || crypto.randomUUID(), */
    }),
    /**localStorage.setItem("cartToken", this.cartToken); premier chargement à déplacer en dehors d'ici */
    actions: {
        getOrCreateCartToken() {
            let token = localStorage.getItem('cartToken');

            if (!token) {
                token = crypto.randomUUID();
                localStorage.setItem('cartToken', token);
            }

            this.cartToken = token;
            return token;
        },
        async addToCart(product, retry = true) {
            this.success = null;
            this.error = null;
            //vérifier pertinence retry
            try {
                const cartToken = this.getOrCreateCartToken();

                await axiosCaller.post(`/cart/${product.id}/add`, {
                    cartToken,
                    quantity: 1,
                });

                const alreadyProducts = this.cart.find((item) => item.id === product.id);

                if (alreadyProducts) {
                    alreadyProducts.quantity++;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }

                await this.validateCart();
                this.syncCartWithLocalStorage();
                this.success = 'success.add-product-cart';
            } catch (err) {
                if (err.response?.status === 409 && retry) {
                    this.resetCart();
                    return this.addToCart(product, false);
                }

                this.error = 'errors.add-product-cart';
                console.error(err.response?.data || err);
            }
        },
        async decreaseQuantity(productId) {
            try {
                const productInCart = this.cart.find((item) => item.id === productId);
                if (!productInCart) return;
                const cartToken = this.getOrCreateCartToken();
                if (productInCart.quantity > 1) {
                    await axiosCaller.post(`/cart/${productId}/remove`, {
                        cartToken,
                        quantity: 1,
                    });
                    productInCart.quantity--;
                } else {
                    await this.removeFromCart(productId);
                    return;
                }
                await this.validateCart();
                this.syncCartWithLocalStorage();
                this.success = 'success.remove-product-cart';
            } catch (err) {
                this.error = 'errors.remove-product-cart';
                console.error(err);
            }
        },
        async removeFromCart(productId) {
            try {
                const productInCart = this.cart.find((item) => item.id === productId);
                if (!productInCart) return;
                const cartToken = this.getOrCreateCartToken();
                await axiosCaller.post(`/cart/${productId}/remove`, {
                    cartToken,
                    quantity: productInCart.quantity,
                });
                this.cart = this.cart.filter((item) => item.id !== productId);
                await this.validateCart();
                this.syncCartWithLocalStorage();
                this.success = 'success.remove-product-cart';
            } catch (err) {
                this.error = 'errors.remove-product-cart';
                console.error(err);
            }
        },
        async validateCart() {
            this.error = null;
            this.success = null;

            try {
                const cartToken = this.getOrCreateCartToken();

                const response = await axiosCaller.post('/cart/validate-cart', {
                    cartToken,
                    cart: this.cart,
                });

                this.cart = response.data.updatedCart;
                this.totalPrice = response.data.total_price;

                this.syncCartWithLocalStorage();
            } catch (err) {
                if (err.response?.status === 409) {
                    this.resetCart();
                    return;
                }

                this.error = 'errors.cart-validation';
                console.error(err.response?.data || err);
            }
        },
        setShippingMethod(method) {
            const shippingPrices = {
                pickup_lyon: 0,
                colissimo_signature: 8,
            };

            if (!(method in shippingPrices)) {
                this.shippingMethod = null;
                this.shippingPrice = 0;
                return;
            }

            this.shippingMethod = method;
            this.shippingPrice = shippingPrices[method];
        },
        persistCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            //delete persistCart
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
        resetCart() {
            this.cart = [];
            this.totalPrice = 0;
            this.cartToken = null;
            this.shippingMethod = null;
            this.shippingPrice = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('cartToken');
        },
        setError(errorMessage) {
            this.error = errorMessage;
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
