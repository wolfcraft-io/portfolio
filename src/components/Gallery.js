import React, { Component } from 'react';
import Photo from './Photo';
import './Gallery.css';

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

class Gallery extends Component {
    constructor() {
        super();
        this.state = {
            columns: this.createColumnIds(),
            photos : [],
         };
    }

    createColumnIds() {
        const numberOfColums = Math.max(Math.ceil(window.innerWidth / 900, 1));
        return Array.from({length: numberOfColums}).map((_,i)=> i);
    }

    getRandomImage() {
        return dummyImages[Math.floor(Math.random() * 10)];
    }

    addPhotoToColumn(columnIndex = 0) {
        const photo = {
            previewImageUrl: this.getRandomImage(),
            description: 'logo-image',
            id : this.nextIdForColumn(columnIndex)
        };
        this.setState({ photos: [...this.state.photos, photo ]});
    }

    nextIdForColumn(columnIndex) {
        const ids = this.getPhotosForColum(columnIndex).map(photo => photo.id);
        console.log({ columnIndex, ids, next: Math.max(ids) + this.state.columns.length });
        if ( ids.length === 0)
            return columnIndex;
        return Math.max(...ids) + this.state.columns.length;
    }

    getPhotosForColum(columnIndex = 0) {
        const { columns, photos } = this.state;
        return photos?.filter(photo => (photo.id + 1) % columns.length === (columnIndex + 1) % columns.length) || [];
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ columns: this.createColumnIds() }));
        setTimeout(() => this.state.columns.forEach(i => this.addPhotoToColumn(i)), 20);
    }

    render() {
        return (
            <div className="gallery">
                { this.state.columns.map(i => this.renderColumn(i)) }
            </div>
        );
    }

    renderColumn(columnIndex) {
        return (
            <div className="column" key={columnIndex}>
                {
                    this.getPhotosForColum(columnIndex)
                        .map(({ previewImageUrl, description, id }) => (
                            <Photo key={id}
                                id={id}
                                previewImageUrl={previewImageUrl}
                                description={description}
                                loadNextPhoto={() => this.addPhotoToColumn(columnIndex)} />))
                }
            </div>
        );

    }
}

export default Gallery;