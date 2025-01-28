import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [], //main state, database state (only source of truth)
        productsPaginatedList: [], //this state is specific for display products in shop, front-end state
        selectedProduct: {},
        /*this state is related to local storage and is the only exception where back is
        not the source of truth.*/
        unavailableProducts: new Set(),
        /*this state is blocking a product with stock 0 in front despite back fetch,
        Set guaranteed unique key and no duplication*/
        /*TODO: the better way is to use the back as only source of truth, especially if the app become more bigger
        we should implement a new field in database for reserved an product stock for an hour for example */
        //big problem when the user go an other page and add a new item and the stock is not empty, the stock is like back-end and not front..
        numberOfProductByPage: 5,
        isLoading: false,
        error: null,
        success: null,
    }),

    getters: {
        filteredProducts: (state) => {
            return (category) => state.products.filter((product) => product.category === category);
        },
    },
    actions: {
        async fetchProducts(category) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await axiosCaller.get('/products');
                //this.products = response.data;
                this.products = response.data.map((product) => {
                    if (this.unavailableProducts.has(product._id)) {
                        product.stock = 0;
                    }
                    return product;
                });

                const filtered = this.filteredProducts(category);
                this.productsPaginatedList = filtered.slice(0, this.numberOfProductByPage);
            } catch (err) {
                this.error = 'errors.display-list';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchProductById(id) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await axiosCaller.get(`/product/${id}`);
                const product = response.data;
                if (this.unavailableProducts.has(product.id)) {
                    product.stock = 0;
                }
                this.selectedProduct = product;
            } catch (err) {
                this.error = 'errors.display-element';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        async deleteProduct(id) {
            this.error = null;
            this.success = null;
            try {
                await axiosCaller.delete(`/product/${id}`);
                this.success = 'success.delete-product';
                //fetch here not in component ??
            } catch (err) {
                this.error = 'errors.delete-product';
                console.error(err);
            }
        },
        async updateProduct(id, updatedProduct) {
            this.error = null;
            this.success = null;

            try {
                await axiosCaller.put(`/product/${id}`, updatedProduct);
                //fetch here not in component ??
                this.success = 'success.update-product';
            } catch (err) {
                this.error = 'errors.update-product';
                console.error(err);
            }
        },
        async addProducts(artworkId, form) {
            this.error = null;
            this.success = null;

            try {
                await axiosCaller.post(`/product/${artworkId}`, form);
                this.success = 'success.add-product';
            } catch (err) {
                this.error = 'errors.add-product';
                console.error(err);
            }
        },

        loadMoreProducts(category) {
            const filtered = this.filteredProducts(category);
            const startIndex = this.productsPaginatedList.length;
            const newProducts = filtered.slice(startIndex, startIndex + this.numberOfProductByPage);
            this.productsPaginatedList = [...this.productsPaginatedList, ...newProducts];
        },
        resetPagination() {
            this.productsPaginatedList = [];
        },

        initializeUnavailableProducts() {
            const storedProducts = JSON.parse(localStorage.getItem('productsUnavailable')) || [];
            this.unavailableProducts = new Set(storedProducts);
        },

        setProductUnavailable(productId) {
            this.unavailableProducts.add(productId);
            this.updateLocalStorage();
        },

        removeProductFromUnavailable(productId) {
            this.unavailableProducts.delete(productId);
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.setItem(
                'productsUnavailable',
                JSON.stringify([...this.unavailableProducts])
            ); //transform Set in string for record it in local storage
        },
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
