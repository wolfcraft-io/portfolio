import React, { Component } from 'react';
import Photo from './Photo';
import './Gallery.css';
import CloseIcon from '../asset-components/CloseIcon';

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: this.createColumnIds(),
            photos : [],
            selectedPhoto: null,
            galleryState: 'emtpy',
            showDescription: !!(new URLSearchParams(window.location.search).get('description')),
         };

         if (!props.contentProvider)
            console.error('No content provider found. Gallery will be empty')
    }

    createColumnIds() {
        const numberOfColums = Math.max(Math.ceil(window.innerWidth / 900, 1));
        const { limit = numberOfColums } = this.props;
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

    selectPhoto(id) {
        const selectedPhoto = this.state.photos.find(p => p.id === id);
        if (!selectedPhoto || this.state.columns.length <= 1)
            this.setState({ selectedPhoto: null });
        else
            this.loadFullsizePhoto(selectedPhoto, window.visualViewport.height);
    }

    loadFullsizePhoto(photo, screenHeight) {
        if(screenHeight * 0.8 > 1296) {
            photo
                .loadFullsize4K()
                .then(base64img => {
                    if (base64img)
                        this.setFullsizePhoto(photo, base64img)
                    else
                        this.loadFullsizePhoto(photo, 1296);
                });
        }
        else {
            photo
                .loadFullsize()
                .then(base64img => this.setFullsizePhoto(photo, base64img || photo.image));
        }
    }

    setFullsizePhoto(photo, base64Image) {
        if (photo)
            this.setState({
                selectedPhoto: {
                        ...photo,
                        id: `${photo.id}_selected`,
                        image: base64Image || photo.image
                    }
                });
    }

    componentDidMount() {
        window.addEventListener('keydown', e => { if (e.key === 'Escape') this.selectPhoto(null); });
        window.addEventListener('resize', () => this.setState({ columns: this.createColumnIds() }));
        setTimeout(() => this.state.columns.forEach(i => this.addPhotoToColumn(i)), 20);
    }

    render() {
        return (
            <div className={ `gallery ${this.state.galleryState}`}>
                { this.state.columns.map(i => this.renderColumn(i)) }
                { this.renderFullscreen() }
            </div>
        );
    }

    renderColumn(columnIndex) {
        return (
            <div className="column" key={columnIndex}>
                {
                    this.getPhotosForColum(columnIndex)
                        .map(({ id, name, hash, labels, image, description }) => (
                            <Photo key={id}
                                id={id}
                                name={name}
                                hash={hash}
                                labels={labels}
                                image={image}
                                description={description}
                                loadNextPhoto={() => setTimeout(() => this.addPhotoToColumn(columnIndex), 10)}
                                onClick={() => this.selectPhoto(id)}
                                showDescription={this.state.showDescription} />))
                }
            </div>
        );
    }

    renderFullscreen() {
        if (!this.state.selectedPhoto)
            return;

        if (this.state.columns.length <= 1) {
            if (this.state.selectedPhoto)
                this.selectPhoto(null);

            return;
        }

        const { id, name, image, description } = this.state.selectedPhoto;
        return (
            <div className="full-screen">
                <div
                    className="background-filter"
                    onClick={() => this.selectPhoto(null)}>
                    <CloseIcon />
                </div>
                <Photo key={id}
                    id={id}
                    name={name}
                    image={image}
                    description={description}
                    showDescription={this.state.showDescription} />
            </div>
        );
    }
}

export default Gallery;