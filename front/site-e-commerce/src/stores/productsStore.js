import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [], //main state, need to re use this state for admin panel
        productsPaginatedList: [], //this state is specific for display products in shop
        numberOfProductByPage: 5,
        isLoading: false,
        error: null,
    }),

    getters: {
        filteredProducts: (state) => (category) => {
            return state.products.filter((product) => product.category === category);
        },
    }, //getter because it's calculated from products for display by category

    actions: {
        async fetchProducts(category) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await axiosCaller.get('/products');
                console.log(response.data);
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
        loadMoreProducts(category) {
            const filtered = this.filteredProducts(category);
            const startIndex = this.productsPaginatedList.length;
            const newProducts = filtered.slice(startIndex, startIndex + this.numberOfProductByPage);
            this.productsPaginatedList = [...this.productsPaginatedList, ...newProducts];
        },
        resetPagination() {
            this.productsPaginatedList = [];
        },
    },
});
/**TODO: maybe add fetchProduct for one product, it might be good when we create update an item with panel admin
 */
