import React, { Component } from 'react';
import Photo from './Photo';
import './Gallery.css';

const dummyImages = [
    '../debug/square.png',
    '../debug/landscape.png',
    '../debug/portrait.png',
    '../debug/portrait.png',
    '../debug/square.png',
    '../debug/landscape.png',
    '../debug/portrait.png',
    '../debug/2-1.png',
    '../debug/landscape.png',
    '../debug/portrait.png'
];

class Gallery extends Component {
    constructor() {
        super();
        this.state = {
            numberOfColums: this.calculateNumberOfColums(),
            photos : [],
         };
    }

    calculateNumberOfColums() {
        return Math.max(Math.ceil(window.innerWidth / 900, 1));
    }

    getRandomImage() {
        return dummyImages[Math.floor(Math.random() * 10)];
    }

    addImage() {
        const photo = {
            previewImageUrl: this.getRandomImage(),
            description: 'logo-image'
        };
        this.setState({ photos: [...this.state.photos, photo ]});
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ numberOfColums: this.calculateNumberOfColums() }));

        //todo add dummy image
        this.addImage();
    }

    render() {
        return (
            <div className="gallery" onClick={() => this.addImage()}>
                {
                    Array
                    .from({length: this.state.numberOfColums})
                    .map((_, i) => this.renderColumn(i))
                }
            </div>
        );
    }

        renderColumn(index) {
        const { numberOfColums = 1, photos } = this.state;
        return (
            <div className="column" key={index}>
                {
                    photos
                        ?.filter((_, i) => (i + 1) % numberOfColums === (index + 1) % numberOfColums)
                        .map(({ previewImageUrl, description }, i) => <Photo key={i} id={i} previewImageUrl={previewImageUrl} description={description} />)
                }
            </div>
        );

    }
}

export default Gallery;