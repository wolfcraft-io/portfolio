class GalleryContentProvider {
    constructor({ getNextPhoto = async () => null } = {}) {
        this._getNextPhoto = getNextPhoto;
    }

    async getNextPhoto() {
        return await this._getNextPhoto();
    }
}

export default GalleryContentProvider;