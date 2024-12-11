import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useArtworksStore = defineStore('artworks', {
    state: () => ({
        artworks: [], //main state, need to re use this state for admin panel
        artworksPaginatedList: [], //this state is specific for display artworks in gallery
        numberOfArtworkByPage: 5,
        isLoading: false,
        error: null,
    }),

    getters: {
        filteredArtworks: (state) => (category) => {
            return state.artworks.filter((artwork) => artwork.type === category);
        },
    }, //getter because it's calculated from artworks for display by category

    actions: {
        async fetchArtworks(category) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await axiosCaller.get('/artworks');
                this.artworks = response.data;
                const filtered = this.filteredArtworks(category);
                this.artworksPaginatedList = filtered.slice(0, this.numberOfArtworkByPage);
            } catch (err) {
                this.error = 'errors.display-list';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        loadMore(category) {
            const filtered = this.filteredArtworks(category);
            const startIndex = this.artworksPaginatedList.length;
            const newArtworks = filtered.slice(startIndex, startIndex + this.numberOfArtworkByPage);
            this.artworksPaginatedList = [...this.artworksPaginatedList, ...newArtworks];
        },
        resetPagination() {
            this.artworksPaginatedList = [];
        },
    },
});
/**TODO: maybe add fetchArtwork for one artwork, it might be good when we create update an item with panel admin
 */
