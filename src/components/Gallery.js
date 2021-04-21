import React, { Component } from 'react';
import Photo from './Photo';
import './Gallery.css';

class Gallery extends Component {
    constructor(props) {
        super();
        this.state = {
            columns: this.createColumnIds(props),
            photos : [],
            galleryState: 'emtpy'
         };

         if (!props.contentProvider)
            console.error('No content provider found. Gallery will be empty')
    }

    createColumnIds(props) {
        const numberOfColums = Math.max(Math.ceil(window.innerWidth / 900, 1));
        const { limit = numberOfColums } = props;
        return Array.from({length: Math.min(numberOfColums, limit) }).map((_,i)=> i);
    }

    contentLoaded() {
        this.setState({ galleryState: 'loaded' });
        this.props?.onContentLoaded();
    }

    addPhotoToColumn(columnIndex = 0) {
        if (this.state.galleryState === 'loaded')
            return;

        const {
            limit,
            contentProvider,
         } = this.props;

        if (!contentProvider || (limit &&  this.state.photos.length >= limit))
            return this.contentLoaded();

        contentProvider
            .getNextPhoto()
            .then(photo => {
                if (!photo)
                    return this.contentLoaded();

                const existingIds = this.getPhotosForColum(columnIndex).map(photo => photo.id);
                const id = ( existingIds.length === 0)
                    ? columnIndex
                    : Math.max(...existingIds) + this.state.columns.length;

                this.setState({
                    photos: [...this.state.photos, { ...photo, id } ],
                    galleryState: 'loading'
                });
            });
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
            <div className={ `gallery ${this.state.galleryState}`}>
                { this.state.columns.map(i => this.renderColumn(i)) }
            </div>
        );
    }

    renderColumn(columnIndex) {
        return (
            <div className="column" key={columnIndex}>
                {
                    this.getPhotosForColum(columnIndex)
                        .map(({ id, name, image, description }) => (
                            <Photo key={id}
                                id={id}
                                name={name}
                                image={image}
                                description={description}
                                loadNextPhoto={() => setTimeout(() => this.addPhotoToColumn(columnIndex), 1000)} />))
                }
            </div>
        );

    }
}

export default Gallery;