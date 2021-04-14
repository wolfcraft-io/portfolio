import React, { Component } from 'react';

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
            <div className="photo">
                <img
                    id={`photo_${id}`}
                    src={previewImageUrl}
                    alt={description} 
                    style={{ width:'100%' }} />
            </div>
            );
    }
}

export default Photo;