import { defineStore } from 'pinia';
import { axiosCaller } from '@/services/axiosCaller';

export const useArtworksStore = defineStore('artworks', {
    state: () => ({
        artworks: [], //main state
        artworksPaginatedList: [], //this state is specific for display artworks in gallery
        selectedArtwork: {},
        numberOfArtworkByPage: 5,
        isLoading: false,
        error: null,
        success: null,
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
        async fetchArtworkById(id) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await axiosCaller.get(`/artwork/${id}`);
                this.selectedArtwork = response.data;
                console.log(response.data);
            } catch (err) {
                this.error = 'errors.display-element';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        async addArtwork(form) {
            this.error = null;
            this.success = null;

            try {
                const formData = new FormData();
                formData.append('title_fr', form.title_fr);
                formData.append('title_en', form.title_en);
                formData.append('type', form.type);
                formData.append('techniques_fr', form.techniques_fr);
                formData.append('techniques_en', form.techniques_en);
                formData.append('dimensions', form.dimensions);
                formData.append('description_fr', form.description_fr);
                formData.append('description_en', form.description_en);

                form.files.forEach((file) => {
                    formData.append('files', file);
                });

                const response = await axiosCaller.post('/artwork', formData);

                this.artworks.push(response.data);
                this.success = 'success.add-artwork';
            } catch (err) {
                this.error = 'errors.add-artwork';
                console.error(err);
            }
        },
        async updateArtwork(id, updatedArtwork) {
            this.error = null;
            this.success = null;

            try {
                await axiosCaller.put(`/artwork/${id}`, updatedArtwork);
                this.success = 'success.update-artwork';
            } catch (err) {
                this.error = 'errors.update-artwork';
                console.error(err);
            }
        },
        async deleteArtwork(id) {
            this.error = null;
            this.success = null;
            try {
                await axiosCaller.delete(`/artwork/${id}`);
                this.success = 'success.delete-artwork';
            } catch (err) {
                this.error = 'errors.delete-artwork';
                console.error(err);
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
        resetErrorSuccess() {
            this.error = null;
            this.success = null;
        },
    },
});
/**TODO: maybe add fetchArtwork for one artwork, it might be good when we create update an item with panel admin
 */
