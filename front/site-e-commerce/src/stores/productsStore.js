import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [], //main state, database state (only source of truth)
        productsPaginatedList: [], //this state is specific for display products in shop, front-end state
        selectedProduct: {},
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
                this.products = response.data;
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
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
