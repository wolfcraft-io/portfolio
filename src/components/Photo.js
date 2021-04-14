import React, { Component } from 'react';
import './Photo.css';

class Photo extends Component {
    render() {
        const {
            id = 'no-id',
            previewImageUrl = null,
            //fullImageUrl = null,
            description = 'No description provied.'
        } = this.props;

        if (!previewImageUrl)
            return;

        if (!description)
            console.error(`Missing discription for '${previewImageUrl}'.`)

        return (
            <div className="photo fade-in">
                <img
                    id={`photo_${id}`}
                    src={previewImageUrl}
                    alt={description} />
            </div>
        );
    }
}

export default Photo;