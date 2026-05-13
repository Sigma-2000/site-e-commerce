import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
        totalPrice: 0,
        success: null,
        error: null,
        cartToken: null,
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
        async addToCart(product) {
            this.success = null;
            try {
                const cartToken = this.getOrCreateCartToken();
                console.log(cartToken);
                const alreadyProducts = this.cart.find((item) => item.id === product.id);
                if (alreadyProducts) {
                    alreadyProducts.quantity++;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }
                //changer ici l'appel api pour la route cart avec le cartToken
                /*await axiosCaller.post(`/product/${product.id}/reservation`, {
                    quantity: 1,
                });*/
                await axiosCaller.post(`/cart/${product.id}/add`, {
                    cartToken,
                    quantity: 1,
                });

                await this.validateCart(); //vérifier si on en a besoin ou pas
                //this.persistCart();
                this.syncCartWithLocalStorage();
                this.success = 'success.add-product-cart';
            } catch (err) {
                this.error = 'errors.add-product-cart';
                console.error(err);
            }
        },
        async decreaseQuantity(productId) {
            try {
                const productInCart = this.cart.find((item) => item.id === productId);
                if (!productInCart) return; //va devoir changer ça car back source vérité
                const cartToken = this.getOrCreateCartToken();
                //changer ici l'appel api pour la route cart avec le cartToken
                /*if (productInCart.quantity > 1) {
                    await axiosCaller.post(`/product/${productId}/remove-reservation`, {
                        quantity: 1,
                    });*/
                if (productInCart.quantity > 1) {
                    await axiosCaller.post(`/cart/${productId}/remove`, {
                        cartToken,
                        quantity: 1,
                    });
                    //voir car si reponse back nop le front ici s'est direct mis à jour et à pas attendu
                    productInCart.quantity--;
                    //bloquer quand rupture de stock !
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
                //changer ici l'appel api pour la route cart avec le cartToken
                /*await axiosCaller.post(`/product/${productId}/remove-reservation`, {
                    quantity: productInCart.quantity,
                });*/
                await axiosCaller.post(`/cart/${productId}/remove`, {
                    cartToken,
                    quantity: productInCart.quantity,
                });
                //checker si le flow est bon
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
            //recup le cart Token en premier lieu
            // sans doute à enlever
            try {
                const response = await axiosCaller.post('/order/validate-cart', {
                    cart: this.cart,
                });
                const updatedCart = response.data.updatedCart;
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
        persistCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            //delete persistCart
        },
        async loadCart() {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                this.cart = JSON.parse(storedCart);
            }
            await this.validateCart(); //devra surement recup le carte Token
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
            localStorage.removeItem('cart');
            localStorage.removeItem('cartToken');
            this.cartToken = null;
            /** ranme it clearLocalCartState()
             * clearCartClientState()
             * clearCartFrontendOnly()*/
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
