import React, { Component } from 'react';
import './Photo.css';

class Photo extends Component {
    constructor() {
        super();
        this.state = { show: false }
    }

    componentDidMount() {
       window.addEventListener('scroll', () => this.onViewportUpdated());
       setTimeout(() => this.onViewportUpdated(), 20);
    }

    triggerLoadNextPhoto() {
        const {loadNextPhoto = () => {}} = this.props;
        loadNextPhoto();
    }

    onViewportUpdated() {
        if(!this.domElement || this.state.show)
            return;

        if (this.domElement.getBoundingClientRect().top <= window.innerHeight) {
            this.setState({ show: true });
            this.triggerLoadNextPhoto();
        }
    }

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
            <div className={`photo ${this.state.show ? 'fade-in' : 'pre-load'}`}
                ref={e => this.domElement = e}>
                <img
                    id={`photo_${id}`}
                    src={previewImageUrl}
                    alt={description} />
            </div>
        );
    }
}

export default Photo;