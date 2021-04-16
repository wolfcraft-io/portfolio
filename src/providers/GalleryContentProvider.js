
const dummyImages = [
    './debug/square.png',
    './debug/landscape.png',
    './debug/portrait.png',
    './debug/portrait.png',
    './debug/square.png',
    './debug/landscape.png',
    './debug/portrait.png',
    './debug/2-1.png',
    './debug/landscape.png',
    './debug/portrait.png'
];

class GalleryContentProvider {

    getPhoto() {
        return this.getPlaceholderPhoto();
    }

    getPlaceholderPhoto() {
        return {
            previewImageUrl: dummyImages[Math.floor(Math.random() * 10)],
            description: 'logo-image',
        };
    }
}

export default GalleryContentProvider;