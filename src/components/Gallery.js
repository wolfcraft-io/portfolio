import React, { Component } from 'react';
import Photo from './Photo';
import './Gallery.css';

class Gallery extends Component {
    constructor(props) {
        super();
        this.state = {
            columns: this.createColumnIds(),
            photos : []
         };

         if (!props.contentProvider)
            console.error('No content provider found. Gallery will be empty')
    }

    createColumnIds() {
        const numberOfColums = Math.max(Math.ceil(window.innerWidth / 900, 1));
        return Array.from({length: numberOfColums}).map((_,i)=> i);
    }

    addPhotoToColumn(columnIndex = 0) {
        this.props
            .contentProvider
            ?.getNextPhoto()
            .then(photo => {
                if (!photo)
                return;

                const existingIds = this.getPhotosForColum(columnIndex).map(photo => photo.id);
                const id = ( existingIds.length === 0)
                    ? columnIndex
                    : Math.max(...existingIds) + this.state.columns.length;;

                this.setState({ photos: [...this.state.photos, { ...photo, id } ]});
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
                        .map(({ id, name, image, description }) => (
                            <Photo key={id}
                                id={id}
                                name={name}
                                image={image}
                                description={description}
                                loadNextPhoto={() => this.addPhotoToColumn(columnIndex)} />))
                }
            </div>
        );

    }
}

export default Gallery;