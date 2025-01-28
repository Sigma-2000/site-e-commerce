import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
        success: null,
    }),
    getters: {
        cartItemCount: (state) => state.cart.length,
        cartTotalPrice: (state) =>
            state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    }, //be careful because this calculculation might be send by backend..
    actions: {
        addToCart(product) {
            this.success = null;
            const alreadyProducts = this.cart.find((item) => item.id === product.id);
            if (alreadyProducts) {
                alreadyProducts.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.success = 'success.add-product-cart';
            this.persistCart(); //better here than in watch in component
        },
        removeFromCart(productId) {
            this.cart = this.cart.filter((item) => item.id !== productId);
            this.syncCartWithLocalStorage();
        },
        updateQuantity(productId, quantity) {
            const product = this.cart.find((item) => item.id === productId);
            if (product) product.quantity = quantity;
            this.syncCartWithLocalStorage();
        },
        persistCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        loadCart() {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                this.cart = JSON.parse(storedCart);
            }
        },
        syncCartWithLocalStorage() {
            if (this.cart.length > 0) {
                localStorage.setItem('cart', JSON.stringify(this.cart));
            } else {
                localStorage.removeItem('cart');
            }
        },
        /** resetErrorSuccess() {
            this.error = null;
            this.success = null; ??
        }, */
        //TODO: need to verify if the cart is available or adjust
    },
});
